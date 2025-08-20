
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';
import TodoList from './components/TodoList';
import EditTodo from "./components/EditTodo";
import { Todo } from "./types/Todo";


const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    // ...your initial todos
  ]);

  const updateTaskText = (id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  return(
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', // fixed typo: alignitems -> alignItems
        height: '100vh',
        backgroundColor: '#f3f4f6',
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/"
            element={<TodoList todos={todos} setTodos={setTodos} />}
          />
          <Route
            path="/edit/:id"
            element={
              <EditTodo
                todos={todos}
                updateTaskText={updateTaskText}
              />
            }
          />
        </Routes>
      </Router>
    </Box>
  );
};

export default App;
