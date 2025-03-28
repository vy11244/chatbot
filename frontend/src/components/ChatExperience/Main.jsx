import { Collapse, Title, Button, Group, Text, ActionIcon, TextInput, Box, Divider } from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import UploadModals from '../../components/Upload/UploadZone';
export default function Main() {
    const [openedChat, { toggle: toggleChat }] = useDisclosure(false);
    const [openedSkills, { toggle: toggleSkills }] = useDisclosure(false);
    const [openedKnowledge, { toggle: toggleKnowledge }] = useDisclosure(false);
    
    const [openingText, setOpeningText] = useState("");
    const [questions, setQuestions] = useState([{ id: 1, text: "" }]);
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedPlugin, setSelectedPlugin] = useState("");
    const [knowledgeText, setKnowledgeText] = useState("");
    const [csvFileName, setCsvFileName] = useState(""); // For displaying file name
    const [csvFile, setCsvFile] = useState(null); // For storing actual file

    const addQuestion = () => {
        if (questions.length < 5) {
            setQuestions([...questions, { id: questions.length + 1, text: "" }]);
        }
    };

    const updateQuestion = (id, text) => {
        setQuestions(questions.map(question => 
            question.id === id ? { ...question, text } : question
        ));
    };

    const deleteQuestion = (id) => {
        setQuestions(questions.filter(question => question.id !== id));
        if (questions.length <= 1) {
            addQuestion();
        }
    };

    const handleSend = (text) => {
        if (text.trim()) {
            setChatHistory([...chatHistory, { text, sender: 'user' }]);
        }
    };

    const handleCsvFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
            setCsvFileName(file.name);
        }
    };

    const handleTextFileUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Handle text file upload
                const reader = new FileReader();
                reader.onload = (event) => {
                    setKnowledgeText(event.target.result);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return (
        <div>
            {/* Chat Experience Section */}
            <Title order={4}>Chat Experience</Title>

            <Text>Opening Text</Text>
            <TextInput
                placeholder="Type your opening text..."
                value={openingText || ""}
                onChange={(event) => setOpeningText(event.currentTarget.value)}
                style={{ marginBottom: '10px' }}
            />
            <Button onClick={() => handleSend(openingText)}>Send Opening Text</Button>

            {/* Rest of your JSX remains the same until CSV section */}
            <UploadModals />
            <Group align="center" style={{ marginBottom: '10px' }}>
                <TextInput
                    placeholder="Upload CSV file"
                    value={csvFileName || ""}
                    onChange={() => {}} // Read-only
                    readOnly
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    id="csvFileInput"
                    onChange={handleCsvFileUpload}
                />
                <ActionIcon onClick={() => document.getElementById('csvFileInput').click()}>
                    <IconPlus />
                </ActionIcon>
            </Group>
        </div>
    );
}