// chatbotStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// Types and Constants
const DEFAULT_MESSAGE = {
  message: "Hello! I can help answer questions about the documents in this project.",
  sentTime: "just now",
  sender: "Assistant",
  direction: "incoming",
  senderAvatar: null
};

const DEFAULT_STATE = {
  messages: [DEFAULT_MESSAGE],
  chatbotName: "AI Assistant",
  headerColor: "#f5f5f5",
  avatarFile: null,
  avatarUrl: null,
  systemPrompt: "",
  optimizedPrompt: "",
  textareaContent: ""
};

// Utility Functions
const validateMessage = (msg) => ({
  message: msg.message || "",
  sentTime: msg.sentTime || new Date().toLocaleTimeString(),
  direction: msg.direction || "outgoing",
  sender: msg.sender || "user",
  senderAvatar: msg.senderAvatar || null
});

const handleAvatarUrl = (prevUrl) => {
  if (prevUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(prevUrl);
  }
};

// Store Creation
export const useChatbotStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        ...DEFAULT_STATE,

        // Message Management
        setMessages: (newMessages) => {
          const validMessages = Array.isArray(newMessages) ? newMessages : [];
          set({ 
            messages: validMessages.map(msg => ({
              ...validateMessage(msg),
              senderAvatar: msg.direction === "incoming" ? get().avatarUrl : null
            }))
          });
        },

        addMessage: (message) => {
          const currentMessages = get().messages || [];
          set({
            messages: [...currentMessages, {
              ...validateMessage(message),
              senderAvatar: message.direction === "incoming" ? get().avatarUrl : null
            }]
          });
        },

        clearMessages: () => set({ messages: [DEFAULT_MESSAGE] }),

        // Avatar Management
        setAvatarFile: (file, base64Url) => {
          handleAvatarUrl(get().avatarUrl);
          
          set({ 
            avatarFile: file,
            avatarUrl: base64Url,
            messages: get().messages.map(msg => ({
              ...msg,
              senderAvatar: msg.direction === "incoming" ? base64Url : null
            }))
          });
        },

        clearAvatar: () => {
          handleAvatarUrl(get().avatarUrl);
          
          set({ 
            avatarFile: null,
            avatarUrl: null,
            messages: get().messages.map(msg => ({
              ...msg,
              senderAvatar: null
            }))
          });
        },

        // Chatbot Settings
        setName: (name) => set({ 
          chatbotName: name,
          messages: get().messages.map(msg => ({
            ...msg,
            sender: msg.direction === "incoming" ? name : msg.sender
          }))
        }),

        setHeaderColor: (color) => set({ headerColor: color }),
        setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
        setOptimizedPrompt: (prompt) => set({ optimizedPrompt: prompt }),
        setTextareaContent: (content) => set({ textareaContent: content }),

        // Backend Integration
        initializeFromBackend: (projectData) => {
          if (!projectData) return;
          
          try {
            const newMessages = projectData.opening_text ? [{
              ...DEFAULT_MESSAGE,
              message: projectData.opening_text,
              sender: projectData.chatbot_name || DEFAULT_STATE.chatbotName,
              senderAvatar: projectData.avatar_url
            }] : [DEFAULT_MESSAGE];

            set({
              messages: newMessages,
              chatbotName: projectData.chatbot_name || DEFAULT_STATE.chatbotName,
              headerColor: projectData.header_color || DEFAULT_STATE.headerColor,
              avatarUrl: projectData.avatar_url || null,
              systemPrompt: projectData.system_prompt || "",
              optimizedPrompt: projectData.optimized_prompt || "",
              textareaContent: projectData.optimized_prompt || projectData.system_prompt || ""
            });
          } catch (error) {
            console.error('Backend initialization error:', error);
            set(DEFAULT_STATE);
          }
        },

        // Reset
        reset: () => {
          handleAvatarUrl(get().avatarUrl);
          set(DEFAULT_STATE);
        }
      }),
      {
        name: 'chatbot-settings',
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
      }
    )
  )
);