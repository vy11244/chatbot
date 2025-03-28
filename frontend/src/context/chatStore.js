// src/stores/chatStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_MESSAGE = {
  message: "Hello! I can help answer questions about the documents in this project.",
  sentTime: "just now",
  sender: "Assistant",
  direction: "incoming",
};

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [DEFAULT_MESSAGE],
      
      setMessages: (newMessages) => {
        if (typeof newMessages === 'function') {
          // Handle function updater
          set((state) => {
            const updatedMessages = newMessages(state.messages);
            return { 
              messages: Array.isArray(updatedMessages) ? updatedMessages : [DEFAULT_MESSAGE] 
            };
          });
        } else if (Array.isArray(newMessages)) {
          // Handle direct array update
          set({ messages: newMessages });
        } else {
          console.error('setMessages called with invalid argument:', newMessages);
          set({ messages: [DEFAULT_MESSAGE] });
        }
      },

      addMessage: (message) => {
        set((state) => ({
          messages: Array.isArray(state.messages) 
            ? [...state.messages, message]
            : [DEFAULT_MESSAGE, message]
        }));
      },

      clearMessages: () => set({ messages: [DEFAULT_MESSAGE] }),

      getMessages: () => {
        const state = get();
        return Array.isArray(state.messages) ? state.messages : [DEFAULT_MESSAGE];
      }
    }),
    {
      name: 'chat-storage',
      onRehydrateStorage: () => (state) => {
        if (!Array.isArray(state?.messages)) {
          state.messages = [DEFAULT_MESSAGE];
        }
      }
    }
  )
)