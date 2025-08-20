import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Todo } from "./types/Todo";
import TodoList from './components/TodoList';


const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    // ...your initial todos
  ]);

  // const updateTaskText = (id: string, newText: string) => {
  //   setTodos(prev =>
  //     prev.map(todo =>
  //       todo.id === id ? { ...todo, text: newText } : todo
  //     )
  //   );
  // };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        py: 6,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 700,
          p: { xs: 2, sm: 4 },
          mt: 4,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(60,60,120,0.12)',
          background: '#fff',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#374151' }}>
          My Todo App
        </Typography>
        <TodoList todos={todos} setTodos={setTodos} />
      </Paper>
    </Box>
  );
};

export default App;
