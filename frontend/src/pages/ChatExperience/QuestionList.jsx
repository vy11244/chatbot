import { Flex, Textarea } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

export default function QuestionList() {
  const [questions, setQuestions] = useState([
    { id: '1', content: 'What is your biggest goal for this year?' },
    { id: '2', content: 'What habit do you want to develop?' },
    { id: '3', content: 'How do you plan to improve your skills?' }
  ]);

  const handleOnDragEnd = (result) => {
    console.log("Drag result:", result); // Debugging line
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update state with reordered items
    setQuestions(items);
  };

  const handleInputChange = (id, value) => {
    const updatedQuestions = questions.map((question) =>
      question.id === id ? { ...question, content: value } : question
    );
    setQuestions(updatedQuestions);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <Flex
            direction="column"
            gap="md"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {questions.map(({ id, content }, index) => (
              <Draggable key={id} draggableId={id} index={index}>
                {(provided) => (
                  <Flex
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    direction="column"
                    p="md"
                    bg="#f0f0f0"
                    style={{
                      ...provided.draggableProps.style,
                    }}
                  >
                    <Textarea
                      placeholder="Enter the opening question"
                      value={content}
                      onChange={(e) => handleInputChange(id, e.target.value)}
                      autosize
                      minRows={2}
                    />
                  </Flex>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  );
}
