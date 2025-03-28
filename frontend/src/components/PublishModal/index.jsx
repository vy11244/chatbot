import React, { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  Text,
  Tabs,
  TextInput,
  Button,
  Code,
  CopyButton,
  List,
  Alert,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconClipboardCopy,
  IconTrash,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export default function PublishModal({
  opened,
  onClose,
  projectId,
  widgetConfig,
  apiKey, // Receive API key as prop
  onConfigUpdate,
}) {
  const [domainInput, setDomainInput] = useState("");
  const [domainList, setDomainList] = useState(
    widgetConfig?.authorized_domains || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync domains when widget config changes
  useEffect(() => {
    setDomainList(widgetConfig?.authorized_domains || []);
  }, [widgetConfig?.authorized_domains]);

  const validateDomain = (domain) => {
    // Allow localhost with port
    if (domain.startsWith('http://localhost:')) {
      return true;
    }
    
    try {
      // Convert URL to hostname only
      const url = new URL(domain);
      return true; // If valid URL, return true
    } catch {
      // If not URL, check if valid domain
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      return domainRegex.test(domain);
    }
  };

  const handleAddDomain = () => {
    if (!domainInput) return;

    if (!validateDomain(domainInput)) {
      notifications.show({
        title: "Invalid Domain",
        message: "Please enter a valid domain name",
        color: "red",
      });
      return;
    }

    if (!domainList.includes(domainInput)) {
      const newDomainList = [...domainList, domainInput];
      setDomainList(newDomainList);
      setDomainInput("");
      onConfigUpdate({
        ...widgetConfig,
        authorized_domains: newDomainList,
      });
    }
  };

  const handleRemoveDomain = (domain) => {
    const newDomainList = domainList.filter((d) => d !== domain);
    setDomainList(newDomainList);
    onConfigUpdate({
      ...widgetConfig,
      authorized_domains: newDomainList,
    });
  };

  // Widget iframe code
  const widgetCode = `<!-- Add this to your website -->
<iframe
  src="${window.location.origin}/widget-page/${projectId}?&apiKey=${apiKey}"
  width="100%"
  height="600px"
  frameborder="0"
  style="border: none;"
  title="Chatbot Widget"
></iframe>`;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Publish Chatbot Widget"
      size="lg"
    >
      <LoadingOverlay visible={isLoading} />
      <Stack spacing="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        <Tabs defaultValue="code">
          <Tabs.List>
            <Tabs.Tab value="code">Integration Code</Tabs.Tab>
            <Tabs.Tab value="domains">Authorized Domains</Tabs.Tab>
            <Tabs.Tab value="apikey">API Key</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="code" pt="xs">
            <Stack>
              <Text size="sm">Add this code to your website:</Text>
              <Alert color="blue" icon={<IconInfoCircle size={16} />}>
                This code should be added just before the closing &lt;/body&gt; tag.
              </Alert>
              <Code block copyable="true">
                {widgetCode}
              </Code>
              <CopyButton value={widgetCode}>
                {({ copied, copy }) => (
                  <Button
                    leftSection={<IconClipboardCopy size={16} />}
                    onClick={copy}
                    color={copied ? "teal" : "blue"}
                  >
                    {copied ? "Copied!" : "Copy code"}
                  </Button>
                )}
              </CopyButton>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="domains" pt="xs">
            <Stack>
              <Group>
                <TextInput
                  style={{ flex: 1 }}
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter domain (e.g. example.com)"
                  onKeyPress={(e) => e.key === "Enter" && handleAddDomain()}
                />
                <Button onClick={handleAddDomain}>Add Domain</Button>
              </Group>
              <List spacing="xs">
                {domainList.map((domain) => (
                  <List.Item
                    key={domain}
                    icon={
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => handleRemoveDomain(domain)}
                      >
                        <IconTrash size={16} />
                      </Button>
                    }
                  >
                    {domain}
                  </List.Item>
                ))}
              </List>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="apikey" pt="xs">
            <Stack>
              <Text size="sm">Your API Key:</Text>
              <Code block copyable="true">
                {apiKey}
              </Code>
              <CopyButton value={apiKey}>
                {({ copied, copy }) => (
                  <Button
                    leftSection={<IconClipboardCopy size={16} />}
                    onClick={copy}
                    color={copied ? "teal" : "blue"}
                  >
                    {copied ? "Copied!" : "Copy API Key"}
                  </Button>
                )}
              </CopyButton>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Modal>
  );
}