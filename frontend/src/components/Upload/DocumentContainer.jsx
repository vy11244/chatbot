// DocumentContainer.jsx
import React, { useState } from 'react';
import { ActionIcon, Paper, Progress, List, Text, Modal } from '@mantine/core';
import { IconFiles } from '@tabler/icons-react';

export default function DocumentContainer({ files, uploadProgress }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setModalOpen(true);
  };

  return (
    <Paper withBorder p="md">
      <ActionIcon size="lg" variant="outline">
        <IconFiles size={24} />
      </ActionIcon>
      <List spacing="xs" size="sm" mt="md">
        {files.map((file, index) => (
          <List.Item key={index} onClick={() => handleFileClick(file)}>
            <Text>{file.name}</Text>
            <Progress value={uploadProgress[file.name] || 0} size="xs" mt="xs" />
          </List.Item>
        ))}
      </List>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="File Details"
      >
        {selectedFile && (
          <div>
            <Text>Name: {selectedFile.name}</Text>
            <Text>Size: {selectedFile.size} bytes</Text>
            <Text>Type: {selectedFile.type}</Text>
          </div>
        )}
      </Modal>
    </Paper>
  );
}