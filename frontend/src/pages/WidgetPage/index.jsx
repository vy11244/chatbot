// src/pages/WidgetPage/index.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import ChatbotWidget from '../../components/ChatbotWidget';
import { validateWidgetApi,getWidgetConfigApi } from '../../apis/widget';

export default function WidgetPage() {
  const { projectId } = useParams();
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

 


  useEffect(() => {
    const initializeWidget = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }
  
      try {
        // Validate domain
        await validateWidgetApi({
          widgetId: projectId,
          domain: window.location.origin,
          onSuccess: () => setIsValid(true),
          onFail: (error) => {
            notifications.show({
              title: 'Error',
              message: error || 'Invalid widget or domain',
              color: 'red'
            });
          }
        });

        
        // Get widget config
        await getWidgetConfigApi({
          widgetId: projectId,
          onSuccess: (data) => {
           
            setConfig({
              widget_id: data.project_id,
              projectId: data.project_id,
              name: data.name,
              user_id: data.user_id,
              apiKey: data.api_key,
              opening_text: data.config.opening_text,
              allowOrigins: data.config.allow_origins,
              authorizedDomains: data.config.authorized_domains,
              avatarUrl: data.config.avatar_url,
              chatbotName: data.config.chatbot_name,
              headerColor: data.config.header_color,
              isActive: data.config.is_active,
              maxMessages: data.config.max_messages,
              position: data.config.position,
              rateLimit: data.config.rate_limit,
              sessionTimeout: data.config.session_timeout,
              trackingEnabled: data.config.tracking_enabled
            });
          },
          onFail: (error) => {
            
            notifications.show({
              title: 'Error', 
              message: error || 'Failed to load configuration',
              color: 'red'
            });
          }
        });
      } catch (error) {
        console.error('Widget initialization error:', error);
      } finally {
        
        setIsLoading(false);
      }
    };
  
    initializeWidget();
  }, [projectId]);

  console.log('Rendering WidgetPage:', { isLoading, isValid, config });

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (!isValid || !config?.isActive) return null;

  return (
    <Box>
      <ChatbotWidget 
        projectId={projectId}
        config={config}
      />
    </Box>
  );
}