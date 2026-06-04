const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());

// JSONファイルの読み書きヘルパー
const readTodos = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeTodos = (todos) => fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));

// GET - 全件取得
app.get('/todos', (req, res) => {
  res.json(readTodos());
});

// POST - 新規追加
app.post('/todos',(req,res)=>{
  const todos = readTodos();
  const newTodo = req.body;
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT - 更新
app.put('/todos/:id',(req,res)=>{
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === req.params.id);
  if(index === -1) return res.status(404).json({error:'Not found'});
  todos[index]={...todos[index], ...req.body};
  writeTodos(todos);
  res.json(todos[index]);
});

// DELETE - 削除
app.delete('/todos/:id',(req,res)=>{
  const todos = readTodos();
  const filtered = todos.filter(t => t.id !== req.params.id);
  writeTodos(filtered);
  res.status(204).send();
});

app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
})