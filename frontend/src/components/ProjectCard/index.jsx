import {
    Card,
    Title,
    Text,
    Group,
    ActionIcon,
    Avatar,
    Tooltip,
    Menu,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import User from "../User";
export default function ProjectCard ({
    id,
    title,
    description,
    actions,
    alias,
    disableNavigate = false,
    }) {
        const { hovered, ref } = useHover();
        const navigate = useNavigate();

          function handleNavigateToProject() {
            if (!disableNavigate) {
              navigate(`/${id}`);
    }
        }

    return (

        <Card withBorder ref={ref} shadow={hovered ? "xl" : "md"}>
            <Group justify="space-between">
                <Title
                    order={5}
                    onClick={handleNavigateToProject}
                    style={{
                        cursor: "pointer",
                    }}
                >
                    {title}

                </Title>
                {actions ? (
                    <Menu withinPortal shadow="md" position="top-end" width={150}>
                        <Menu.Target>
                            <ActionIcon variant="light" color="gray">
                                <IconDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown p={5}>{actions}</Menu.Dropdown>
                    </Menu>
                ) : null}
            </Group>
                <Text size="sm">{description}</Text>
                <Group justify="space-between" align="flex-end">
        <Text size="xs" c="dimmed">
          {alias}
        </Text>
        <User />
        </Group>
            
        </Card>

);
}