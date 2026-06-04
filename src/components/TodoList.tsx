import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography
} from '@mui/material';
import TodoItem from './TodoItem';
import DatePicker from './DatePicker';
import { Todo } from '../types/Todo';


type TodoListProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<Todo['priority']>("MEDIUM");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();


  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTask,
      done: false,
      priority: priority,
      createdAt: new Date(),
      dueDate: newTaskDueDate,
    };

    setTodos([...todos, newTodo]);
    setNewTask("");
    setNewTaskDueDate(undefined);
  };

  const handleDelete = (taskId: string) => {
    setTodos(todos.filter(task => task.id !== taskId));
  }

  const toggleDone = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }


  const updatePriority = (id: string, newPriority: "HIGH" | "MEDIUM" | "LOW") => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  }

  const sortAndFilterTodos = () => {
    let filtered = todos
      .filter(todo =>
        todo.text.toLowerCase().includes(searchKeyword.toLowerCase())
      );

    // 期限切れ > 優先度 > 期限日 の順でソート
    return filtered.sort((a, b) => {
      
      // 優先度でソート
      const priorityOrder = { "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // 期限日でソート（早い順）
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return 0;
    });
  };

  const filteredTodos = sortAndFilterTodos();

  const updateTaskText = (id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const updateTaskDueDate = (id: string, dueDate: Date | undefined) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, dueDate } : todo
      )
    );
  };

  return (
    <div>
        <TextField
          fullWidth
          variant="outlined"
          label="検索..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />

        {/* 新しいタスク追加 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
            新しいタスクを追加
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="新しいタスクを追加"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl>
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

              <DatePicker
                dueDate={newTaskDueDate}
                onDateChange={setNewTaskDueDate}
                label="期限日時"
              />

              <Button variant="contained" color="primary" onClick={addTask}>
                追加
              </Button>
            </Box>
          </Box>
        </Box>
        
        {/* タスクリストの表示 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
            タスクリスト
          </Typography>

          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onToggleDone={toggleDone}
                onUpdatePriority={updatePriority}
                onUpdateText={updateTaskText}
                onUpdateDueDate={updateTaskDueDate}
              />
            ))
          ) : (
            <p>タスクが見つかりませんでした</p>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default TodoList;
