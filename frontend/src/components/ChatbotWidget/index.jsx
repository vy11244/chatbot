import React, { useState, useEffect } from 'react';
import { Box, LoadingOverlay, ActionIcon, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import defaultAvatar from '../../assets/chatbot.png';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar
} from "@chatscope/chat-ui-kit-react";
import styles from './ChatbotWidget.module.css';
import { IconMessage, IconX, IconMessageCircle, IconBrandMessenger, IconMessageChatbot  } from '@tabler/icons-react';
import { 
  chatWithWidgetApi, 
  getWidgetSessionApi,
  getChatHistoryWidgetApi,
} from "../../apis/widget";

export default function ChatbotWidget({ projectId, config: initialConfig }) {



  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState({
    chatbotName: initialConfig?.chatbotName || "AI Assistant",
    headerColor: initialConfig?.headerColor || "#228be6",
    avatarUrl: initialConfig?.avatarUrl || defaultAvatar,
    apiKey: initialConfig?.apiKey,
    userId: initialConfig?.user_id, // Add userId from initialConfig
    opening_text: initialConfig?.opening_text || "Hello! I can help answer questions about the documents in this project."
  });

  useEffect(() => {
    // Set initial message when chat first opens
    if (isOpen) {
      const initialMessage = {
        message: config.opening_text,
        sender: config.chatbotName,
        direction: "incoming",
        sentTime: new Date().toLocaleTimeString(),
        avatar: config.avatarUrl,
        position: "single"
      };
      setLocalMessages([initialMessage]);
    }
  }, [isOpen]); // Only depend on isOpen state

  useEffect(() => {
    if (isOpen && sessionId) {
      loadChatHistory(sessionId);
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    const initializeWidget = async () => {
      try {
        const sessionResponse = await getWidgetSessionApi({
          projectId: projectId,
          apiKey: config.apiKey,
          userId: config.userId, // Add userId here
          onSuccess: (data) => {
            setSessionId(data.session_id);
            loadChatHistory(data.session_id);
          },
          onFail: (error) => {
            notifications.show({
              title: "Error",
              message: "Failed to initialize chat session",
              color: "red"
            });
          }
        });
      } catch (error) {
        console.error('Widget initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (config.apiKey && config.userId) { // Check for both required fields
      initializeWidget();
    }
  }, [projectId, config.apiKey, config.userId]);

  const loadChatHistory = async (currentSessionId) => {
    try {
      await getChatHistoryWidgetApi({
        projectId: projectId,
        sessionId: currentSessionId,
        apiKey: config.apiKey,
        userId: config.userId, // Add userId here
        onSuccess: (data) => {
          setLocalMessages(data.messages || []);
        },
        onFail: (error) => {
          console.error('Failed to load chat history:', error);
        }
      });
    } catch (error) {
      console.error('Chat history error:', error);
    }
  };

  const handleSend = async (message) => {
    if (!sessionId) {
      notifications.show({
        title: "Error",
        message: "Chat session not initialized",
        color: "red"
      });
      return;
    }
  
    try {
      const newMessage = {
        message,
        direction: "outgoing", 
        sender: "user",
        sentTime: new Date().toLocaleTimeString(),
        position: "single"
      };
  
      setLocalMessages(prev => [...prev, newMessage]);
      setIsTyping(true);
  
      await chatWithWidgetApi({
        projectId,
        message,
        sessionId,
        userId: config.userId, // Pass userId to the API call
        apiKey: config.apiKey,
        modelName: "gemini",
        system_prompt: config.systemPrompt || "", // Add system prompt from config
        onSuccess: (response) => {
          if (response?.message) {
            setLocalMessages(prev => [...prev, {
              message: response.message,
              sender: config.chatbotName,
              direction: "incoming",
              sentTime: new Date().toLocaleTimeString(),
              avatar: config.avatarUrl,
              position: "single"
            }]);
          }
        },
        onFail: (error) => {
          notifications.show({
            title: "Error",
            message: error,
            color: "red"
          });
        }
      });
    } catch (error) {
      console.error('Send message error:', error);
      notifications.show({
        title: "Error",
        message: "Failed to send message",
        color: "red" 
      });
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) return <LoadingOverlay visible />;

  return (
    <Box className={styles.widgetContainer}>
      <ActionIcon
        className={styles.chatButton}
        onClick={toggleChat}
        style={{ 
          backgroundColor: "LightSkyBlue",
          display: isOpen ? 'none' : 'flex'
        }}
        size="xl"
        radius="xl"
        variant="filled"
      >
        <IconMessageChatbot size={28} color="white" stroke={2.5} />
      </ActionIcon>
  
      {isOpen && (
        <Box 
          className={styles.chatWindow}
          style={{
            display: isOpen ? 'block' : 'none'
          }}
        >
          <Group 
            className={styles.header} 
            style={{ backgroundColor: config.headerColor }}
          >
            <div className={styles.headerLeft}>
              {config.avatarUrl && (
                <img 
                  src={config.avatarUrl} 
                  alt="Bot Avatar" 
                  className={styles.headerAvatar}
                />
              )}
              <Text className={styles.headerTitle}>{config.chatbotName}</Text>
            </div>
            <ActionIcon
              onClick={toggleChat}
              className={styles.closeButton}
              variant="transparent"
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>
  
          <MainContainer>
            <ChatContainer>
            <MessageList
  scrollBehavior="smooth"
  typingIndicator={
    isTyping ? (
      <TypingIndicator content={`${config.chatbotName} is thinking...`} />
    ) : null
  }
>
  {localMessages.map((message, i) => (
    <Message
      key={i}
      model={{
        message: message.message,
        sentTime: message.sentTime,
        sender: message.direction === "incoming" ? config.chatbotName : "user",
        direction: message.direction,
        position: "single",
      }}
      avatarPosition={message.direction === "incoming" ? "cl" : "cr"}
      style={{
        marginBottom: "8px"
      }}
    >
      {message.direction === "incoming" && (
        <Avatar 
          src={config.avatarUrl} 
          name={config.chatbotName}
          size="sm"
        />
      )}
    </Message>
  ))}
</MessageList>
              <MessageInput
                attachButton={false}
                placeholder="Type your message..."
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </Box>
      )}
    </Box>
  );
}