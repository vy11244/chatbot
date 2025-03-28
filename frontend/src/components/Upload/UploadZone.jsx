import { ActionIcon, Modal, Paper, Text, Group, Button, Stack, List, Divider, ThemeIcon, Loader } from '@mantine/core';
import { IconFiles, IconX, IconTrash, IconFileText, IconFileTypePdf, IconFileTypeTxt, IconFileTypeDoc, IconFileTypeDocx } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { uploadDocumentsApi, getAllDocumentsApi, deleteDocumentApi, getDocumentApi } from '../../apis/knowledge';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import useDocumentsState from '../../context/knowledge';
import useGlobalState from '../../context/global';

export default function UploadZone() {
  const { projectId } = useParams();
  const user = useGlobalState((state) => state.user);
  const { documents, uploadingFiles, setUploadingFiles, setDocuments, addDocuments } = useDocumentsState();
  const [isLoading, setIsLoading] = useState(true);
  
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileDetails, setSelectedFileDetails] = useState(null);
  const [fileDetailModalOpened, setFileDetailModalOpened] = useState(false);

  // File icon helper
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return { icon: <IconFileTypePdf size={16} />, color: 'red' };
      case 'doc':
      case 'docx': return { icon: <IconFileTypeDoc size={16} />, color: 'blue' };
      case 'txt': return { icon: <IconFileTypeTxt size={16} />, color: 'gray' };
      default: return { icon: <IconFileText size={16} />, color: 'teal' };
    }
  };

  // Load documents on mount
  useEffect(() => {
    const loadDocuments = async () => {
      if (!projectId) return;
      setIsLoading(true);
      try {
        await getAllDocumentsApi({
          projectId,
          onSuccess: (data) => setDocuments(data || []),
          onFail: (error) => {
            notifications.show({
              title: 'Error',
              message: error,
              color: 'red',
            });
          },
        });
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDocuments();
  }, [projectId, setDocuments]);

  // Event handlers
  const handleDelete = async (e, documentId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const documentToDelete = documents.find(doc => doc.document_id === documentId);
    
    try {
      // Remove immediately from UI
      setDocuments(prevDocs => prevDocs.filter(doc => doc.document_id !== documentId));
  
      // Call API
      await deleteDocumentApi({
        documentId,
        onSuccess: () => {
          notifications.show({
            title: 'Success',
            message: 'Document deleted successfully',
            color: 'green'
          });
        },
        onFail: (error) => {
          // Restore document on failure
          setDocuments(prevDocs => [...prevDocs, documentToDelete]);
          notifications.show({
            title: 'Error',
            message: error || 'Failed to delete document',
            color: 'red'
          });
        }
      });
    } catch (error) {
      // Restore document on error
      setDocuments(prevDocs => [...prevDocs, documentToDelete]);
      console.error('Delete error:', error);
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red'
      });
    }
  };

  const handleUpload = () => {
    if (!projectId) {
      notifications.show({
        title: 'Error',
        message: 'Project ID is required',
        color: 'red'
      });
      return;
    }

    setUploadingFiles(selectedFiles);
    setSelectedFiles([]);
    close();

    uploadDocumentsApi({
      document_files: selectedFiles,
      projectId,
      onSuccess: (uploadedDocs) => {
        addDocuments(uploadedDocs);
        notifications.show({
          title: 'Success',
          message: 'Documents uploaded successfully',
          color: 'green'
        });
        setUploadingFiles([]);
      },
      onFail: (error) => {
        setUploadingFiles([]);
        notifications.show({
          title: 'Error',
          message: error || 'Failed to upload documents',
          color: 'red'
        });
      }
    });
  };

  const showFileDetails = async (doc) => {
    try {
      await getDocumentApi({
        documentId: doc.document_id,
        onSuccess: (data) => {
          setSelectedFileDetails(data);
          setFileDetailModalOpened(true);
        },
        onFail: (error) => {
          notifications.show({
            title: 'Error',
            message: error || 'Failed to get document details',
            color: 'red'
          });
        }
      });
    } catch (error) {
      console.error('Get document details error:', error);
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red'
      });
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Render component
  return (
    <Stack spacing="xs">
      <Paper shadow="md" radius="md" withBorder p="xl">
        <Stack spacing="md">
          <ActionIcon size="lg" variant="outline" onClick={open}>
            <IconFiles size={24} />
          </ActionIcon>

          {/* Uploading files list */}
          {uploadingFiles.length > 0 && (
            <List spacing="xs">
              {uploadingFiles.map((file, index) => (
                <List.Item key={index} icon={<Loader size={16} />}>
                  <Text size="sm">{file.name} (Uploading...)</Text>
                </List.Item>
              ))}
            </List>
          )}

          {/* Documents list */}
          <Stack spacing="xs">
            {documents.length > 0 && (
              <List spacing="xs">
                {documents.map((doc) => {
                  const { icon, color } = getFileIcon(doc.document_name);
                  return (
                    <List.Item
                      key={doc.document_id}
                      onClick={() => showFileDetails(doc)}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      icon={
                        <ThemeIcon color={color} size={24} radius="xl">
                          {icon}
                        </ThemeIcon>
                      }
                    >
                      <Group position="apart" style={{ width: '100%' }}>
                        <Text size="sm">{doc.document_name}</Text>
                        <ActionIcon 
                          color="red" 
                          onClick={(e) => handleDelete(e, doc.document_id)}
                          sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </List.Item>
                  );
                })}
              </List>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* File Details Modal */}
      <Modal
        opened={fileDetailModalOpened}
        onClose={() => setFileDetailModalOpened(false)}
        title="File Details"
        size="lg"
      >
        {selectedFileDetails && (
          <Stack spacing="md">
            <Stack spacing="xs">
              <Text><b>Name:</b> {selectedFileDetails.document_name}</Text>
            </Stack>
            <Divider />
            <Stack spacing="xs">
              <Text fw={500}>Summary:</Text>
              <Text 
                size="sm" 
                style={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5
                }}
              >
                {selectedFileDetails.summary}
              </Text>
            </Stack>
          </Stack>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal opened={opened} onClose={close} title="Add Documents">
        <Dropzone
          onDrop={(files) => setSelectedFiles((prev) => [...prev, ...files])}
          maxSize={30 * 1024 ** 2}
          accept={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
          }}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <IconFiles size={50} stroke={1.5} />
            <div>Drag documents here or click to select files</div>
            <div style={{ fontSize: '0.8em', color: 'gray' }}>
              Accepted files: PDF, DOC, DOCX, TXT (max 30MB)
            </div>
          </div>
        </Dropzone>

        <Text mt="md" weight={500}>Selected Documents:</Text>
        {selectedFiles.map((file, index) => (
          <Group key={index} position="apart" mt="xs">
            <Text size="sm">{file.name}</Text>
            <ActionIcon onClick={() => removeFile(index)} color="red">
              <IconX size={18} />
            </ActionIcon>
          </Group>
        ))}

        {selectedFiles.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <Button variant="outline" color="blue" onClick={handleUpload}>
              Confirm
            </Button>
          </div>
        )}
      </Modal>
    </Stack>
  );
}