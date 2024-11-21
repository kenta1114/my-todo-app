import React,{useState} from 'react';
import {TextField,Button,Box} from '@mui/material';
import TodoItem from './TodoItem';

interface Todo{
  id:number;
  text:string;
}

const TodoList:React.FC=()=>{
  const [todos,setTodos] = useState<Todo[]>([]);
  const [searchKeyword,setSearchKeyword] = useState("");
  const [newTask, setNewTask] = useState("");

  const filteredTodos = todos.filter((todo)=>todo.text.toLowerCase().includes(searchKeyword.toLowerCase()));

  const addTask=()=>{
    if(!newTask.trim()) return;
    setTodos((prevTodos)=>[...prevTodos,
      {id:prevTodos.length+1, text:newTask},
    ]);
    setNewTask("");
  };

  return(
    <div>
      <Box sx={{width: "400px", margin: "0 auto", padding: "20px"}}>
        <TextField
          fullWidth
          variant="outlined"
          label="検索..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />

        {/* 新しいタスクを追加する部分*/}
          <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="新しいタスクを追加"
              value={newTask}
              onChange={(e)=>setNewTask(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={addTask}>
              追加
            </Button>
          </Box>
          
          {/*タスクリストの表示 */}
          {filteredTodos.length>0?(
            filteredTodos.map((todo)=><TodoItem key={todo.id} todo={todo}/>)
          ):(
            <p>タスクが見つかりませんでした</p>
          )}
      </Box>
    </div>
  );
};
export default TodoList;