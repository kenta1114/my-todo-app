import React,{useState} from 'react';
import TodoItem from './TodoItem';
import {TextField,Button,Box,Paper,Typography} from '@mui/material';

interface Todo{
  id:number;
  text:string;
}

const TodoList:React.FC=()=>{
  const [todos,setTodos] = useState<Todo[]>([]);
  const [input,setInput] = useState('');

  const addTodo=()=>{
    if(input.trim()){
      setTodos([...todos,{id:Date.now(),text:input}]);
      setInput('');
    }
  };

  return(
    <div>
      <Paper
        elevation={3}
        sx={{
          maxWidth:'600px',
          margin:'0 auto',
          padding:'20px',
          borderRadius:'10px',
          boxShadow:'0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor:'#fafafa',
        }}
      >
        <Typography
          variant="h5"
          sx = {{fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#333', marginBottom: '10px'}}
        >
          Notion Style Todo List
        </Typography>

        <Box display="flex" alignItems="center" marginBottom="20px">
          <TextField
            label="Add a task"
            variant="outlined"
            fullWidth
            size="small"
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            sx={{
              backgroundColor:'#fff',
              borderRadius:'8px',
            }}
          />
          <Button
            variant="contained"
            onClick={addTodo}
            sx={{
              marginLeft:'10px',
              backgroundColor:'#0078d4',
              color:'#fff',
              ':hover':{backgroundColor:'#005bb5'},
            }}
          >
            Add
          </Button>
        </Box>

        {todos.map((todo)=>(
          <TodoItem key={todo.id} todo={todo}/>
        ))}
      </Paper>
    </div>
  );
};
export default TodoList;