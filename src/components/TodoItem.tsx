import React from 'react';
import {Card,CardContent,Checkbox,Typography} from '@mui/material';

interface TodoItemProps{
  todo:{
    id:number;
    text:string;
  };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete })=>{
  return(
    <Card
      variant="outlined"
      sx={{
        display:'flex',
        alignItems:'center',
        padding:'10px',
        borderRadius:'8px',
        boxshadow:'none',
        marginBottom:'8px',
        borderColor:'#e0e0e0',
      }}  
    >
      <Checkbox color="default"/>
      <CardContent sx={{padding:'0',flexGrow:1}}>
        <Typography variant="body1" sx={{fontFamily:'Arial',color:'#333'}}>
          {todo.text}
        </Typography>
      </CardContent>
    </Card>
     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
      <span>{todo.text}（{todo.category}）</span>
      <button onClick={() => onDelete(todo.id)}>削除</button>
    </div>
  );
};

export default TodoItem;
