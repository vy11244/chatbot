import React, { useState } from "react";
import { debounce } from 'lodash';
import {
  Group,
  Text,
  FileInput,
  ActionIcon,
  ColorInput,
  TextInput,
  Paper,
  ScrollArea,
  Box,
  Flex,
  Grid,
} from "@mantine/core";
import { IconTrash, IconRobot } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useChatbotStore } from "../../context/ChatbotStore";
import { updateProjectFieldsApi } from "../../apis/projects";
import { notifications } from "@mantine/notifications";
import Preview from "../../components/Preview";
import defaultAvatar from '../../assets/chatbot.png';

export default function ChatbotConfig() {
  const { projectId } = useParams();
  const {
    avatarUrl,
    setAvatarFile,
    clearAvatar,
    headerColor,
    setHeaderColor,
    chatbotName,
    setName,
  } = useChatbotStore();

  const [isAvatarSaving, setIsAvatarSaving] = useState(false);
  const [isNameSaving, setIsNameSaving] = useState(false);
  const [isColorSaving, setIsColorSaving] = useState(false);
  const [draftName, setDraftName] = useState(chatbotName);
  const [colorPickerOpened, setColorPickerOpened] = useState(false);

  const updateField = debounce(async (fields, setLoadingState) => {
    if (!projectId) return;
    
    setLoadingState(true);
    try {
      await updateProjectFieldsApi({
        projectId,
        fields,
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Settings updated",
            color: "green"
          });
        },
        onFail: (error) => {
          notifications.show({
            title: "Error",
            message: error || "Failed to update",
            color: "red"
          });
        }
      });
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoadingState(false);
    }
  }, 500);

  const handleAvatarChange = async (file) => {
    if (file) {
      setIsAvatarSaving(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        setAvatarFile(file, reader.result);
        await updateField({ avatar_url: reader.result }, setIsAvatarSaving);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetAvatar = async () => {
    setIsAvatarSaving(true);
    try {
      await updateField({ avatar_url: null }, setIsAvatarSaving);
      clearAvatar();
    } catch (error) {
      console.error("Error resetting avatar:", error);
    }
  };

  const handleChatbotNameChange = (event) => {
    setDraftName(event.currentTarget.value);
  };

  const handleChatbotNameBlur = async () => {
    if (draftName !== chatbotName) {
      setName(draftName);
      await updateField({ chatbot_name: draftName }, setIsNameSaving);
    }
  };

  const handleHeaderColorChange = async (color) => {
    setHeaderColor(color);
    await updateField({ header_color: color }, setIsColorSaving);
  };

  const handleColorPickerClose = () => {
    setColorPickerOpened(false);
  };

  return (
    <Grid>
      <Grid.Col span={7}>
        <Paper shadow="xs" radius="md" withBorder p="xl">
          <ScrollArea h="calc(100vh - 140px)" type="auto" offsetScrollbars>
            <Flex direction="column" gap="xl">
              <Flex direction="column" gap="md">
                <Group align="center" spacing="xs">
                  <IconRobot size={23} color="gray" />
                  <Text fw={600}>Chatbot Avatar</Text>
                </Group>
                <Group align="flex-start">
                  <FileInput
                    style={{ flex: 1 }}
                    placeholder="Upload avatar image"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    loading={isAvatarSaving || undefined}
                  />
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={handleResetAvatar}
                    title="Reset avatar"
                    disabled={isAvatarSaving}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Flex>

              <Flex direction="column" gap="md">
                <Group align="center" spacing="xs">
                  <IconRobot size={23} color="gray" />
                  <Text fw={600}>Chatbot Name</Text>
                </Group>
                <TextInput
                  placeholder="Enter chatbot name"
                  value={draftName}
                  onChange={handleChatbotNameChange}
                  onBlur={handleChatbotNameBlur}
                  disabled={isNameSaving}
                />
              </Flex>

              <Flex direction="column" gap="md">
                <Group align="center" spacing="xs">
                  <IconRobot size={23} color="gray" />
                  <Text fw={600}>Header Color</Text>
                </Group>
                <ColorInput
  value={headerColor}
  onChange={handleHeaderColorChange}
  disabled={isColorSaving}
  opened={colorPickerOpened}
  onDropdownOpen={() => setColorPickerOpened(true)}
  onDropdownClose={handleColorPickerClose}
  closeOnClickOutside
  withinPortal
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
              systemPrompt=""
              customSettings={{
                chatbotName: draftName,
                headerColor,
                avatarUrl: avatarUrl || defaultAvatar,
              }}
            />
          </Box>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}