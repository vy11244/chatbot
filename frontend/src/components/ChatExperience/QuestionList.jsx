// src/components/ChatExperience/QuestionList.jsx
import { List, ListItem, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export default function QuestionList() {
  return (
    <List>
      <List.Item>
        What is your question 1?
        <ActionIcon color="red" size="lg" ml="sm">
          <IconTrash />
        </ActionIcon>
      </List.Item>
      <List.Item>
        What is your question 2?
        <ActionIcon color="red" size="lg" ml="sm">
          <IconTrash />
        </ActionIcon>
      </List.Item>
      {/* Thêm các câu hỏi khác nếu cần */}
      <List.Item>
        <input type="text" placeholder="Add your question here..." />
      </List.Item>
    </List>
  );
}
