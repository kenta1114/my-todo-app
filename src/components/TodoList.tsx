import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  text: string;
  category: string;
  done:boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("仕事");
  const [filter, setFilter] = useState("すべて");

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: newTask,
      category: category,
    };

    setTodos([...todos, newTodo]);
    setNewTask("");
  };

  const handleDelete = (taskId: number) => {
    setTodos(todos.filter(task => task.id !== taskId));
  };

  const filteredTodos = todos
    .filter(todo =>
      filter === "すべて" ? true : todo.category === filter
    )
    .filter(todo =>
      todo.text.toLowerCase().includes(searchKeyword.toLowerCase())
    );

  const toggleDone=(id:number)=>{
    setTodos(prev=>
      prev.map(todo=>
        todo.id === id ? {...todo, done:!todo.done}:todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.done));
  };

  

  
  return (
    <div>
      <Box sx={{ width: "400px", margin: "0 auto", padding: "20px" }}>
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

        {/* カテゴリ選択 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px", marginLeft: "8px", marginBottom: "20px" }}
        >
          <option value="仕事">仕事</option>
          <option value="買い物">買い物</option>
          <option value="趣味">趣味</option>
        </select>

        {/* カテゴリフィルター */}
        <div style={{ marginBottom: "20px" }}>
          <label>カテゴリで絞り込む:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="すべて">すべて</option>
            <option value="仕事">仕事</option>
            <option value="買い物">買い物</option>
            <option value="趣味">趣味</option>
          </select>
        </div>

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
            <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} onToggleDone={toggleDone} />
          ))
        ) : (
          <p>タスクが見つかりませんでした</p>
        )}
      </Box>
    </div>
  );
};

export default TodoList;
