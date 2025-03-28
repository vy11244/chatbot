// Develop.jsx
import React, { useState, useEffect  } from "react";
import {
  AppShell,
  Group,
  Text,
  Textarea,
  HoverCard,
  Box,
  Flex,
  Grid,
  ActionIcon,
  Paper,
  ScrollArea,
  Loader,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { optimizePromptApi } from "../../apis/knowledge";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import UploadZone from "../../components/Upload/UploadZone";
import { updateProjectFieldsApi } from "../../apis/projects";
import { debounce } from "lodash"; // Add debounce to prevent too many updates
import {useChatbotStore} from "../../context/ChatbotStore";
import {
  IconMessageCircle,
  IconFileSearch,
  IconHelpOctagon,
  IconCircleLetterA,
  IconVocabulary,
} from "@tabler/icons-react";
import appStrings from "../../utils/strings";
import Preview from "../../components/Preview";
import { notifications } from "@mantine/notifications";
import { getProjectApi } from "../../apis/projects"; // Add this import
import defaultAvatar from '../../assets/chatbot.png';

export default function DevelopPage() {
  const {
    messages,
    setMessages,
    updateOpeningText,
    chatbotName,
    headerColor,
    avatarUrl,
    systemPrompt,
    optimizedPrompt,
    textareaContent,
    setSystemPrompt,
    setOptimizedPrompt,
    setTextareaContent,
  } = useChatbotStore();

  const [opened, { toggle }] = useDisclosure(false);
  const [draftOpeningText, setDraftOpeningText] = useState("");
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false); // Add loading state
  const [initialLoading, setInitialLoading] = useState(true);
  const [draftSystemPrompt, setDraftSystemPrompt] = useState(textareaContent);
  const [projectLoadError, setProjectLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadProjectSettings = async () => {
      try {
        setInitialLoading(true);
        const projectData = await getProjectApi(projectId);
        
        if (projectData) {
          useChatbotStore.getState().initializeFromBackend(projectData);
          setDraftOpeningText(projectData.opening_text || "");
          setTextareaContent(projectData.optimized_prompt || projectData.system_prompt || "");
          setOptimizedPrompt(projectData.optimized_prompt || "");
          setSystemPrompt(projectData.system_prompt || "");
        }
      } catch (error) {
        console.error("Failed to load project settings:", error);
        setProjectLoadError(true);
        
        notifications.show({
          title: "Error",
          message: error.message || "Failed to load project settings",
          color: "red"
        });
        
        // Optionally redirect to 404 page if project not found
        if (error.message === 'Project not found') {
          // navigate('/404');
        }
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (projectId) {
      loadProjectSettings();
    }
  }, [projectId]);

  useEffect(() => {
    setDraftOpeningText(messages[0]?.message || "");
  }, [messages]);

  const updateProjectFields = debounce(async (fields) => {
    await updateProjectFieldsApi({
      projectId,
      fields,
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Project updated successfully",
          color: "green",
        });
      },
      onFail: (error) => {
        notifications.show({
          title: "Error",
          message: error || "Failed to update project",
          color: "red",
        });
      },
    });
  }, 1000);

  // Modify text area onChange handlers
  const handleSystemPromptChange = (event) => {
    const value = event.currentTarget.value;
    setDraftSystemPrompt(value);
  };
  
  const handleSystemPromptBlur = async () => {
    if (draftSystemPrompt !== systemPrompt) {
      setTextareaContent(draftSystemPrompt);
      setOptimizedPrompt(draftSystemPrompt);
      setSystemPrompt(draftSystemPrompt);
      
      try {
        await updateProjectFields({
          system_prompt: draftSystemPrompt,
          optimized_prompt: draftSystemPrompt,
        });
      } catch (error) {
        // Revert changes on error
        setDraftSystemPrompt(systemPrompt);
        setTextareaContent(systemPrompt);
        setOptimizedPrompt(systemPrompt);
        
        notifications.show({
          title: "Error",
          message: error || "Failed to update system prompt",
          color: "red"
        });
      }
    }
  };

  const handleOpeningTextChange = (event) => {
    // Only update draft state - don't update messages or save yet
    const newText = event.currentTarget.value;
    setDraftOpeningText(newText);
  };
  const handleOpeningTextBlur = async () => {
    if (draftOpeningText !== messages[0]?.message) {
      const newMessage = {
        message: draftOpeningText,
        sentTime: "just now",
        sender: chatbotName,
        direction: "incoming",
        senderAvatar: avatarUrl
      };
  
      // Update messages in both store and Preview
      setMessages([newMessage, ...messages.slice(1)]);
      useChatbotStore.getState().setMessages([newMessage, ...messages.slice(1)]);
  
      try {
        await updateProjectFieldsApi({
          projectId,
          fields: {
            opening_text: draftOpeningText
          },
          onSuccess: () => {
            notifications.show({
              title: "Success", 
              message: "Opening text updated successfully",
              color: "green"
            });
          },
          onFail: (error) => {
            // Revert changes
            const originalMessage = messages[0]?.message || "";
            setDraftOpeningText(originalMessage);
            setMessages(messages);
            useChatbotStore.getState().setMessages(messages);
            
            notifications.show({
              title: "Error",
              message: error || "Failed to update opening text",
              color: "red"
            });
          }
        });
      } catch (error) {
        console.error("Error updating opening text:", error);
        // Revert changes
        const originalMessage = messages[0]?.message || "";
        setDraftOpeningText(originalMessage);
        setMessages(messages);
        useChatbotStore.getState().setMessages(messages);
      }
    }
  };

  const handleOptimizePrompt = async () => {
  if (!textareaContent.trim()) {
    notifications.show({
      title: "Error", 
      message: "Please enter a prompt to optimize",
      color: "red",
    });
    return;
  }

  setLoading(true);
  await optimizePromptApi({
    prompt: textareaContent,
    model_name: "gemini",
    onSuccess: async (data) => {
      setTextareaContent(data);
      setOptimizedPrompt(data);
      setSystemPrompt(data);
      setDraftSystemPrompt(data); // Add this line
      await updateProjectFields({
        system_prompt: data,
        optimized_prompt: data,
      });
      notifications.show({
        title: "Success",
        message: "Prompt optimized and saved successfully", 
        color: "green",
      });
      setLoading(false);
    },
    onFail: (error) => {
      console.error("Optimization error:", error);
      notifications.show({
        title: "Error",
        message: error || "Failed to optimize prompt",
        color: "red",
      });
      setLoading(false);
    },
  });
};
  return (
    <Grid>
      
      <Grid.Col span={7}>
        <Paper shadow="xs" radius="md" withBorder p="xl">
          <ScrollArea h="calc(100vh - 140px)" type="auto" offsetScrollbars>
            <Flex direction="column" gap="xl">
              {/* System Prompt Section */}
              <Flex direction="column" gap="md">
                <Group align="center" spacing="xs">
                  <IconFileSearch size={23} color="gray" />
                  <Text fw={600}>{appStrings.language.develop.title1}</Text>
                  <HoverCard position="top">
                    <HoverCard.Target>
                      <IconHelpOctagon size={23} color="gray" />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="xs">{appStrings.language.develop.instruction}</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Group>

                <Textarea
  variant="filled"
  placeholder={appStrings.language.develop.description}
  autosize
  minRows={2}
  styles={{
    input: {
      border: "1px solid #ced4da", 
      borderRadius: "4px",
      "&:focus": {
        borderColor: "#228be6",
      },
    },
  }}
  value={draftSystemPrompt}
  onChange={handleSystemPromptChange}
  onBlur={handleSystemPromptBlur}
  rightSection={
    <ActionIcon
      padding="md"
      color="gray" 
      onClick={handleOptimizePrompt}
      disabled={loading}
    >
      {loading ? <Loader size="sm" /> : <IconCircleLetterA size={21} />}
    </ActionIcon>
  }
/>
              </Flex>

              {/* Upload Zone Section */}
              <Flex direction="column" gap="md">
                <Group align="center" spacing="xs">
                  <IconFileSearch size={23} color="gray" />
                  <Text fw={600}>{appStrings.language.develop.title2}</Text>
                  <HoverCard position="top">
                    <HoverCard.Target>
                      <IconHelpOctagon size={23} color="gray" />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="xs">{appStrings.language.develop.knowledge}</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Group>
                <UploadZone />
              </Flex>

              {/* Opening Text Section */}
              <Flex direction="column" gap="md">
                <Group align="center" spacing="xs">
                  <IconMessageCircle size={23} color="gray" />
                  <Text fw={600}>{appStrings.language.develop.title3}</Text>
                  <HoverCard position="top">
                    <HoverCard.Target>
                      <IconHelpOctagon size={23} color="gray" />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="xs">{appStrings.language.develop.description1}</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Group>
                <Textarea
                  variant="filled"
                  placeholder={appStrings.language.develop.openingText}
                  autosize
                  minRows={2}
                  value={draftOpeningText}
                  onChange={handleOpeningTextChange}
                  onBlur={handleOpeningTextBlur}
                />
              </Flex>
            </Flex>
          </ScrollArea>
        </Paper>
      </Grid.Col>

      <Grid.Col span={5}>
        <Paper style={{ height: "calc(100vh - 140px)" }} shadow="xs" radius="md" withBorder p="xl">
          <Box style={{ height: "100%" }}>
            <Preview
              systemPrompt={systemPrompt}
              customSettings={{
                chatbotName,
                headerColor,
                avatarUrl: avatarUrl || defaultAvatar
              }}
            />
          </Box>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}