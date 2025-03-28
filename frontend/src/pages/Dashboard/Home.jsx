import { Button, Flex, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CreateProjectDrawer from "../Drawer/CreateProjectDrawer";
import { IconPlus } from "@tabler/icons-react";
import appStrings from "../../utils/strings";
import ProjectCard from "../../components/ProjectCard";
import YourProjectAction from "../../components/Actions/YourProjectAction";
import Empty from "../../components/Empty";
import { getYourProjectsApi } from "../../apis/dashboard";
import { deleteProjectApi } from "../../apis/projects";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import GridLayout from "../../components/Layout/GridLayout";
import useGlobalState from "../../context/global";
import useProjectsState from "../../context/project";
import useNotification from "../../hooks/useNotification";
import { useEffect } from 'react';
// import ChatbotWidget from '../../components/ChatbotWidget';


export default function HomePage() {
  const [isNewProjectOpen, newProjectToggle] = useDisclosure(false);
  const user = useGlobalState((state) => state.user);
  const projects = useProjectsState((state) => state.projects);
  const setProjects = useProjectsState((state) => state.setProjects);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const removeProject = useProjectsState((state) => state.removeProject);


  useEffect(() => {
    if (user) {
      getYourProjectsApi({
        onFail: (msg) => {
          errorNotify({ message: msg });
          setProjects([]);
        },
        onSuccess: (data) => {
          setProjects(data);
        },
      });
    }
  }, [user]);
  
  function handleDeleteProject(projectId) {
    deleteProjectApi({
      projectId,
      onFail: (msg) => {
        errorNotify({ message: msg });
      },
      onSuccess: (projectId) => {
        removeProject(projectId);
        successNotify({
          message: "Project deleted successfully"
        });
      },
    });
  }

  return (
    <Flex direction="column" gap={30}>
      <HeadingLayout loading={!user}>
        <Title order={1}>
          Welcome
          {user?.name}
        </Title>
        <Flex>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={newProjectToggle.open}
          >
            {appStrings.language.home.createBtn}
          </Button>
        </Flex>
      </HeadingLayout>
      {projects?.length !== 0 ? (
        <GridLayout
          title={appStrings.language.home.recentProjects}
          loading={!projects}
        >
          {projects?.map((data, index) => (
            <ProjectCard
              key={index}
              id={data.project_id}
              title={data.name}
              description={data.description}
              alias={data.alias}
              members={data.members}
              actions={
                <YourProjectAction
                  onDeleteTap={() => handleDeleteProject(data.project_id)}
                />
              }
            />
          ))}
        </GridLayout>
      ) : (
        <Empty />
      )}
      <Flex direction="column" gap={30}>
        <CreateProjectDrawer
          open={isNewProjectOpen}
          onClose={newProjectToggle.close}
        />
      {/* <ChatbotWidget
      projectId="2soAiPH5HJsmg8OWbweb"
      config={{
        chatbotName: "Support Bot",
        headerColor: "#962626",
        avatarUrl: "/path/to/avatar.png",
        position: "bottom-right"}}/> */}
      </Flex>
    </Flex>
  );
}