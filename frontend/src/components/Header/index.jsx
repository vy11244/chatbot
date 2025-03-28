  // src/components/Header/index.jsx
  import style from "./style.module.css";
  import { Button, Group, Tabs, Box, Loader } from '@mantine/core';
  import { useState, useEffect } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { notifications } from '@mantine/notifications';
  import { updateProjectFieldsApi } from '../../apis/projects';
  import { publishChatbotApi } from "../../apis/knowledge";
  import { createWidgetApi,UpdateWidgetConfig } from "../../apis/widget";
  import { useChatbotStore } from '../../context/ChatbotStore';
  import { IconArrowLeft } from '@tabler/icons-react';
  import PublishModal from "../PublishModal";

  export default function Header() {
    const [projectApiKey, setProjectApiKey] = useState('');
    const [widgetApiKey, setWidgetApiKey] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [activeTab, setActiveTab] = useState('Develop');
    const [loading, setLoading] = useState(false);
    const [publishModalOpened, setPublishModalOpened] = useState(false);
    const navigate = useNavigate();
    const { projectId } = useParams();

    const {
      chatbotName,
      headerColor,
      avatarUrl,
      systemPrompt,
      messages
    } = useChatbotStore();

    const [widgetConfig, setWidgetConfig] = useState({
      chatbotName,
      headerColor,
      avatarUrl,
      position: "bottom-right",
      authorized_domains: [],
      maxMessages: 50,
      session_timeout: 30,
      rate_limit: 60,
      tracking_enabled: true,
      opening_text: messages[0]?.message,
      is_active: true
    });

    useEffect(() => {
      setWidgetConfig(prev => ({
        ...prev,
        chatbotName,
        headerColor,
        avatarUrl,
        opening_text: messages[0]?.message,
        system_prompt: systemPrompt
      }));
    }, [chatbotName, headerColor, avatarUrl, messages, systemPrompt]);

    const handleTabChange = (value) => {
      setActiveTab(value);
      navigate(`/${projectId}${value === 'ChatbotConfig' ? '/chatbot-config' : ''}`);
    };

    const handlePublish = async () => {
      setLoading(true);
      try {
        await publishChatbotApi({
          projectId,
          widgetConfig: {
            chatbot_name: chatbotName,
            header_color: headerColor,
            avatar_url: avatarUrl,
            opening_text: messages[0]?.message,
            is_active: true,
            position: "bottom-right", 
            authorized_domains: [],
            max_messages: 50,
            session_timeout: 30,
            rate_limit: 60
          },
          onSuccess: async (publishData) => {
            const projectKey = publishData.apiKey;
            setProjectApiKey(projectKey);
    
            // Create widget with same config
            await createWidgetApi({
              project_id: projectId,
              name: chatbotName || 'My Chatbot',
              apiKey: projectKey,
              config: {
                chatbot_name: chatbotName,
                header_color: headerColor,
                avatar_url: avatarUrl,
                opening_text: messages[0]?.message,
                system_prompt: systemPrompt,
                is_active: true
              },
              onSuccess: (widgetData) => {
                setWidgetApiKey(widgetData.api_key);
                setIsPublished(true);
                setPublishModalOpened(true);
                notifications.show({
                  title: 'Success',
                  message: 'Widget published with current settings',
                  color: 'green'
                });
              },
              onFail: (error) => {
                notifications.show({
                  title: 'Error',
                  message: error || 'Failed to create widget',
                  color: 'red'
                });
              }
            });
          }
        });
      } catch (error) {
        console.error('Publish error:', error);
      } finally {
        setLoading(false); 
      }
    };
    
    const handleModalClose = () => {
      setPublishModalOpened(false);
    };

    const handleConfigUpdate = async (newConfig) => {
      const updatedConfig = {
        ...widgetConfig,
        ...newConfig
      };
      
      setWidgetConfig(updatedConfig);
    
      try {
        await UpdateWidgetConfig({
          project_id: projectId, // Change from project_id to widgetId
          config: {
            // Transform config to match API expectations
            chatbot_name: updatedConfig.chatbotName,
            header_color: updatedConfig.headerColor,
            avatar_url: updatedConfig.avatarUrl,
            opening_text: updatedConfig.opening_text,
            system_prompt: updatedConfig.system_prompt,
            is_active: updatedConfig.is_active,
            position: updatedConfig.position,
            authorized_domains: updatedConfig.authorized_domains,
            max_messages: updatedConfig.maxMessages,
            session_timeout: updatedConfig.session_timeout,
            rate_limit: updatedConfig.rate_limit,
            tracking_enabled: updatedConfig.tracking_enabled
          },
          onSuccess: () => {
            notifications.show({
              title: 'Success',
              message: 'Widget configuration updated',
              color: 'green'
            });
          },
          onFail: (error) => {
            console.error('Failed to update configuration:', error);
            notifications.show({
              title: 'Error',
              message: error || 'Failed to update configuration', 
              color: 'red'
            });
          }
        });
      } catch (error) {
        console.error('Config update error:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to save configuration',
          color: 'red'
        });
      }
    };

    return (
      <>
        <Box className={style.header}>
          <Button 
            variant="subtle"
            size="sm"
            className={style.backButton}
            onClick={() => navigate('/dashboard')}
            leftSection={<IconArrowLeft size={16} />}
          >
            Back
          </Button>
          
          <Group className={style.tabGroup}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tabs.List>
                <Tabs.Tab 
                  value="Develop"
                  className={`${style.tab} ${activeTab === 'Develop' ? style.activeTab : ''}`}
                >
                  Develop
                </Tabs.Tab>
                <Tabs.Tab 
                  value="ChatbotConfig"
                  className={`${style.tab} ${activeTab === 'ChatbotConfig' ? style.activeTab : ''}`}
                >
                  ChatbotConfig
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Group>

          <Button 
            color="blue"
            variant="subtle" 
            size="sm"
            className={style.publishButton}
            onClick={handlePublish}
            disabled={loading}
            leftSection={loading && <Loader size="xs" color="white" />}
          >
            Publish
          </Button>
        </Box>

        <PublishModal
          opened={publishModalOpened}
          onClose={handleModalClose}
          projectId={projectId}
          widgetConfig={widgetConfig}
          apiKey={widgetApiKey} // Pass widget API key
          onConfigUpdate={handleConfigUpdate}
        />
      </>
    );
  }