import { Collapse, Title, Button, Group, Text, ActionIcon, TextInput, Box, Divider } from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export default function Main() {
    const [openedChat, { toggle: toggleChat }] = useDisclosure(false);
    const [openedSkills, { toggle: toggleSkills }] = useDisclosure(false);
    const [openedKnowledge, { toggle: toggleKnowledge }] = useDisclosure(false);
    
    const [openingText, setOpeningText] = useState(""); // State cho Opening Text
    const [questions, setQuestions] = useState([{ id: 1, text: "" }]); // Danh sách câu hỏi mở

    // State cho phần Skills
    const [selectedPlugin, setSelectedPlugin] = useState("");
    
    // State cho phần Knowledge
    const [knowledgeText, setKnowledgeText] = useState("");
    const [csvFile, setCsvFile] = useState(null);

    // Hàm để thêm câu hỏi mới
    const addQuestion = () => {
        if (questions.length < 5) { // Giới hạn tối đa 5 câu hỏi
            setQuestions([...questions, { id: questions.length + 1, text: "" }]);
        }
    };

    // Hàm để cập nhật câu hỏi
    const updateQuestion = (id, text) => {
        setQuestions(questions.map(question => (question.id === id ? { ...question, text } : question)));
    };

    // Hàm để xóa câu hỏi
    const deleteQuestion = (id) => {
        setQuestions(questions.filter(question => question.id !== id));
        if (questions.length <= 1) {
            addQuestion(); // Nếu xóa hết câu hỏi thì thêm lại ô rỗng
        }
    };

    return (
        <div>
            {/* Chat Experience Section */}
            <Title order={4}>Chat Experience</Title>

            {/* Opening Text Section */}
            <Text>Opening Text</Text>
            <TextInput
                placeholder="Type your opening text..."
                value={openingText}
                onChange={(event) => setOpeningText(event.currentTarget.value)}
                style={{ marginBottom: '10px' }}
            />

            {/* Preset Opening Questions Section */}
            <Text>Preset Opening Questions</Text>
            <Button
                justify='flex-start'
                size="md"
                onClick={toggleChat}
                variant="subtle"
                fullWidth
                leftSection={<>{openedChat ? <IconChevronDown /> : <IconChevronRight />}</>}
            >
                Manage Preset Questions
            </Button>
            <Collapse in={openedChat}>
                {questions.map((question) => (
                    <Group key={question.id} align="center" style={{ marginBottom: '10px' }}>
                        <TextInput
                            placeholder="Type your preset question..."
                            value={question.text}
                            onChange={(event) => updateQuestion(question.id, event.currentTarget.value)}
                            rightSection={
                                <ActionIcon onClick={() => deleteQuestion(question.id)}>
                                    <IconTrash />
                                </ActionIcon>
                            }
                        />
                    </Group>
                ))}
                <Button onClick={addQuestion} variant="outline" fullWidth>
                    + Add Question
                </Button>
            </Collapse>
            <Divider my="md" />

            {/* Skills Section */}
            <Title order={4}>Skills</Title>
            <Button
                justify='flex-start'
                size="md"
                onClick={toggleSkills}
                variant="subtle"
                fullWidth
                leftSection={<>{openedSkills ? <IconChevronDown /> : <IconChevronRight />}</>}
            >
                Plugins
            </Button>
            <Collapse in={openedSkills}>
                <Text>Plugins allow the agent to call external APIs that enable it to search for information, browse web pages, generate images, and more, expanding the agent's capabilities and applications.</Text>
                <TextInput
                    placeholder="Select model (e.g., Gemini, gpt4o)"
                    value={selectedPlugin}
                    onChange={(event) => setSelectedPlugin(event.currentTarget.value)}
                    style={{ marginTop: '10px' }}
                />
            </Collapse>
            <Divider my="md" />

            {/* Knowledge Section */}
            <Title order={4}>Knowledge</Title>
            <Button
                justify='flex-start'
                size="md"
                onClick={toggleKnowledge}
                variant="subtle"
                fullWidth
                leftSection={<>{openedKnowledge ? <IconChevronDown /> : <IconChevronRight />}</>}
            >
                Knowledge Sources
            </Button>
            <Collapse in={openedKnowledge}>
                <Text>Text Knowledge</Text>
                <Group align="center" style={{ marginBottom: '10px' }}>
                    <TextInput
                        placeholder="Enter text knowledge..."
                        value={knowledgeText}
                        onChange={(event) => setKnowledgeText(event.currentTarget.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <ActionIcon onClick={() => alert('Upload text file feature coming soon!')}>
                        <IconPlus />
                    </ActionIcon>
                </Group>
                <Text>CSV Knowledge</Text>
                <Group align="center" style={{ marginBottom: '10px' }}>
                    <TextInput
                        placeholder="Upload CSV file"
                        value={csvFile}
                        onChange={(event) => setCsvFile(event.currentTarget.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <ActionIcon onClick={() => alert('Upload CSV file feature coming soon!')}>
                        <IconPlus />
                    </ActionIcon>
                </Group>
            </Collapse>
        </div>
    );
}
