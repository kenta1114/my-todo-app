import React, { useState } from 'react';
import { 
  TextField, 
  Button,
  Box, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import TodoItem from './TodoItem';

interface Todo {
  id: string;
  text: string;
  done:boolean;
  priority:"HIGH" | "MEDIUM" | "LOW";
}

const PRIORITY_CONFIG={
  HIGH: { label: '高', color: '#ef4444', bgColor: '#fef2f2' },
  MEDIUM: { label: '中', color: '#f59e0b', bgColor: '#fffbeb' },
  LOW: { label: '低', color: '#10b981', bgColor: '#f0fdf4' }
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority]=useState<Todo['priority']>("MEDIUM");

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTask,
      done: false,
      priority:priority,
    };

    setTodos([...todos, newTodo]);
    setNewTask("");
  };

  const handleDelete = (taskId: string) => {
    setTodos(todos.filter(task => task.id !== taskId));
  };

  const toggleDone=(id:string)=>{
    setTodos(prev=>
      prev.map(todo=>
        todo.id === id ? {...todo, done:!todo.done}:todo
      )
    );
  };

  const updatePriority = (id:string, newPriority:"HIGH" | "MEDIUM" | "LOW")=>{
    setTodos(prev=>
      prev.map(todo=>
        todo.id === id ?{...todo, priority:newPriority} :todo
      )
    )
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.done));
  };

  const sortAndFilterTodos = ()=>{
    let filtered = todos
      .filter(todo=>
        todo.text.toLowerCase().includes(searchKeyword.toLowerCase())
      );

    const priorityOrder = {"HIGH":3, "MEDIUM":2, "LOW":1};
    return filtered.sort((a,b)=>priorityOrder[b.priority]-priorityOrder[a.priority]);
  }

  const priorityStats={
    HIGH: todos.filter(t => t.priority === 'HIGH' && !t.done).length,
    MEDIUM: todos.filter(t => t.priority === 'MEDIUM' && !t.done).length,
    LOW: todos.filter(t => t.priority === 'LOW' && !t.done).length,
  }

  const filteredTodos = sortAndFilterTodos();

  return (
    <div>
      <Box sx={{ width: "400px", margin: "0 auto", padding: "20px" }}>
        {/* 優先度統計 */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, justifyContent: 'center' }}>
          {Object.entries(priorityStats).map(([key, count]) => (
            <Box
              key={key}
              sx={{
                textAlign: 'center',
                padding: 2,
                borderRadius: 2,
                backgroundColor: PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].bgColor,
                minWidth: 80
              }}
            >
              <Box sx={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].color
              }}>
                {count}
              </Box>
              <Box sx={{ fontSize: '12px', marginTop: 0.5 }}>
                {PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].label}優先度
              </Box>
            </Box>
          ))}
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="検索..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />

        {/* 新しいタスク追加 */}
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="新しいタスクを追加"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={addTask}>
            追加
          </Button>
        </Box>

        {/* 優先度選択 */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>優先度</InputLabel>
            <Select
              value={priority}
              label="優先度"
              onChange={(e) => setPriority(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
            >
              <MenuItem value="HIGH">高</MenuItem>
              <MenuItem value="MEDIUM">中</MenuItem>
              <MenuItem value="LOW">低</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="outlined"
          color="secondary"
          onClick={clearCompleted}
          sx={{ marginTop: '10px' }}
        >
        完了したタスクを削除
        </Button>

        {/* タスクリストの表示 */}
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo}  onDelete={handleDelete} onToggleDone={toggleDone} onUpdatePriority={updatePriority} />
          ))
        ) : (
          <p>タスクが見つかりませんでした</p>
        )}
      </Box>      
    </div>
  );
};

export default TodoList;
