import {
  Modal,
  Flex,
  TextInput,
  Textarea,
  Button,
  Title,
  Container,
} from "@mantine/core";
import appStrings from "../../utils/strings";
import {v4 as uuidv4} from 'uuid';
import {getAliasByName  } from "../../utils/utils";
import { useRef, useState } from "react";
import { createProjectApi } from "../../apis/projects";
import useProjectsState from "../../context/project";
import useNotification from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";



export default function CreateProjectDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addProject = useProjectsState((state) => state.addProject);
  const idAlias = useRef(uuidv4());
  const errorNotify = useNotification({ type: "error" });


  const handleInputChange = (event) => {
    setProjectName(event.target.value);
  };

  function handleCreateProject() {
    const alias = getAliasByName(projectName, idAlias.current);
    setIsLoading(true);
    createProjectApi({
      name: projectName,
      alias,
      description,
      onFail: (msg) => {
        setIsLoading(false);
        errorNotify({ message: msg });
      },
      onSuccess: (project) => {
        addProject(project);
        setIsLoading(false);
        // Sửa từ project.id thành project.project_id
        navigate(`/${project.project_id}`);
        onClose(); // Đóng modal sau khi tạo thành công
      },
    });
  }

  return (
    <Modal opened={open} onClose={onClose} size ='md' title={appStrings.language.createBot.title} centered>
      
        <Flex
          gap="lg"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          
          <TextInput
            label={appStrings.language.createBot.nameLabel}
            placeholder={appStrings.language.createBot.nameLabel}
            variant="filled"
            style={{ width: "100%" }}
            onChange={handleInputChange}
            value={projectName}
            required
          />
          <Textarea
            variant="filled"
            label={appStrings.language.createBot.descriptionLabel}
            placeholder={appStrings.language.createBot.descriptionLabel}
            style={{ width: "100%" ,height: "120px" }}
            autosize
            minRows={4}
            maxRows={8}
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </Flex>
        <Flex justify="flex-end" gap="md" style={{ marginTop: "20px" }}>
          <Button variant="default" onClick={onClose}>
            {appStrings.language.btn.cancel}
          </Button>
          <Button
            onClick={handleCreateProject}
            loading={isLoading}
            disabled={!projectName}
          >
            {appStrings.language.btn.create}
          </Button>
        </Flex>
      
    </Modal>
  )
}