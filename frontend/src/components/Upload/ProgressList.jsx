import {
  Paper,
  List,
  ThemeIcon,
  Loader,
  rem,
  Flex,
  Button,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import appStrings from "../../utils/strings";

export default function ProgressList({ items, isClosable, onClose }) {
  return (
    <Paper shadow="lg" p="md" withBorder>
      <List spacing="md" center>
        {Object.entries(items).map(([name, status], index) => (
          <List.Item
            key={index}
            icon={
              status === 'success' ? (
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              ) : (
                <ThemeIcon size={24} radius="xl">
                  <Loader size={rem(16)} color="white" />
                </ThemeIcon>
              )
            }
          >
            <Flex align="center">
              {name}
            </Flex>
          </List.Item>
        ))}
      </List>
      {isClosable && (
        <Button onClick={onClose} size="xs" mt="md">
          {appStrings.language.btn.close}
        </Button>
      )}
    </Paper>
  );
}