// Preview.jsx
import { Box, Text, ActionIcon, Group } from "@mantine/core";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultAvatar from '../../assets/chatbot.png'; // Adjust path as needed
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import { getAnswersApi } from "../../apis/knowledge";
import { IconTrash } from "@tabler/icons-react";
import { useChatbotStore } from "../../context/ChatbotStore";

export default function Preview({
  systemPrompt,
  customSettings = {
    chatbotName: "AI Assistant",
    headerColor: "#f5f5f5",
    avatarUrl: defaultAvatar,
  }
}) {
  const { projectId } = useParams();
  const { messages = [], setMessages, addMessage, clearMessages } = useChatbotStore();
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const {
    chatbotName = "AI Assistant",
    headerColor = "#f5f5f5",
    avatarUrl = defaultAvatar,
  } = customSettings || {};

  
  useEffect(() => {
    if (!Array.isArray(messages)) {
      setMessages([DEFAULT_MESSAGE]);
    }
  }, []);

  const handleSend = async (message) => {
    try {
      if (!projectId) {
        setError("No project ID");
        return;
      }

      // Add user message
      const userMessage = {
        message,
        direction: "outgoing",
        sender: "user",
        sentTime: new Date().toLocaleTimeString(),
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      setError(null);

      const response = await getAnswersApi({
        question: message,
        projectId,
        modelName: "gemini",
        promptTemplate: systemPrompt || "",
      });

      if (response?.data?.answer) {
        const sources = Array.isArray(response.data.sources) ? response.data.sources : [];
        const sourceText = sources.length > 0 
          ? "\n\nSources: " + sources.map(s => s.document_name || '').filter(Boolean).join(", ")
          : "";

        // Add AI response
        const aiMessage = {
          message: response.data.answer + sourceText,
          sender: customSettings.chatbotName,
          direction: "incoming",
          sentTime: new Date().toLocaleTimeString(),
          avatar: customSettings.avatarUrl,
          sources: sources
        };
        
        addMessage(aiMessage);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to get response");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box
      p="md"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #ddd",
          backgroundColor: headerColor,
        }}
      >
        <Group spacing="sm">
          {avatarUrl && (
            <Avatar src={avatarUrl} size="md" radius="xl" alt={chatbotName} />
          )}
          <Text size="lg" weight="bold">
            {chatbotName}
          </Text>
        </Group>
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={clearMessages}
          title="Clear chat history"
        >
          <IconTrash size={20} />
        </ActionIcon>
      </Box>

      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? (
                <TypingIndicator content={`${chatbotName} is thinking...`} />
              ) : null
            }
          >
            {error && (
              <Text c="red" size="sm" p="xs">
                {error}
              </Text>
            )}
            {messages.map((message, i) => (
              <Message
                key={i}
                model={{
                  message: message.message,
                  sentTime: message.sentTime,
                  sender: message.direction === "incoming" ? chatbotName : "user",
                  direction: message.direction,
                  position: "single",
                  avatar: message.direction === "incoming" ? avatarUrl : undefined,
                }}
                avatarPosition={message.direction === "incoming" ? "cl" : "cr"}
                style={{
                  marginBottom: "8px"
                }}
              >
                {message.direction === "incoming" && (
                  <Avatar src={avatarUrl} name={chatbotName} size="sm" />
                )}
              </Message>
            ))}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Ask a question about the project documents..."
            onSend={handleSend}
            
          />
        </ChatContainer>
      </MainContainer>
    </Box>
  );
}