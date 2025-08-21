import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Todo } from "./types/Todo";
import TodoList from './components/TodoList';
import Navigation from './components/Navigation'; // 追加
import Settings from './components/Settings'; // 追加
import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    // ...your initial todos
  ]);

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
      {/* ナビゲーションバー */}



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
        <TodoList todos={todos} setTodos={setTodos} />
        <Routes>
          <Route path="/" element={<TodoList todos={todos} setTodos={setTodos} />} />
          <Route path="/settings" element={<Settings todos={todos} setTodos={setTodos} />} />
          <Navigation />
        </Routes>
      </Paper>
    </Box>
  )
};

export default App;
