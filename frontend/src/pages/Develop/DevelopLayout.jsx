// DevelopLayou.jsx
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { AppShell, Loader, Center } from "@mantine/core";
import { useChatbotStore } from "../../context/ChatbotStore";
import { getProjectApi } from "../../apis/projects";
import Header from "../../components/Header";

export default function DevelopLayout() {
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { initializeFromBackend } = useChatbotStore();

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectApi(projectId);
        if (projectData) {
          initializeFromBackend(projectData);
        }
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <AppShell header={{ height: 50 }} padding="sm">
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}