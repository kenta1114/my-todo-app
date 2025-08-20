import React from 'react';
import {Card,CardContent,Checkbox,Typography,
  Box, 
  Chip, 
  Select, 
  MenuItem, 
  FormControl,
  IconButton,
} from '@mui/material';

interface Todo{
  id: string;
  text: string;
  done: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onUpdatePriority:(id:string,newPriority:"HIGH" | "MEDIUM" | "LOW") => void;
  onUpdateText?: (id: string, newText: string) => void;
}

const PRIORITY_CONFIG = {
  HIGH: { label: '高', color: '#ef4444', bgColor: '#fef2f2' },
  MEDIUM: { label: '中', color: '#f59e0b', bgColor: '#fffbeb' },
  LOW: { label: '低', color: '#10b981', bgColor: '#f0fdf4' }
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo, 
  onDelete, 
  onToggleDone, 
  onUpdatePriority,
})=>{

  const priorityConfig = PRIORITY_CONFIG[todo.priority];

  return(
    <>
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
        <Checkbox
          checked={todo.done}
          onChange={() => onToggleDone(todo.id)}
          color="default"
        />
        
        <CardContent sx={{padding:'0',flexGrow:1}}>
          <Typography variant="body1" sx={{fontFamily:'Arial',color:'#333'}}>
            {todo.text}
          </Typography>

          <Chip
            label={priorityConfig.label}
            size="small"
            sx={{
              backgroundColor: priorityConfig.color + '20',
              color: priorityConfig.color,
              fontWeight: 'bold',
              fontSize: '11px'
            }}
          />
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 60 }}>
          <Select
            value={todo.priority}
            onChange={(e) => onUpdatePriority(todo.id, e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
            disabled={todo.done}
            sx={{ 
              fontSize: '12px',
              '& .MuiSelect-select': {
                padding: '4px 8px'
              }
            }}
          >
            <MenuItem value="HIGH" sx={{ fontSize: '12px' }}>高</MenuItem>
            <MenuItem value="MEDIUM" sx={{ fontSize: '12px' }}>中</MenuItem>
            <MenuItem value="LOW" sx={{ fontSize: '12px' }}>低</MenuItem>
          </Select>
        </FormControl>

        <IconButton 
          onClick={() => onDelete(todo.id)}
          size="small"
          sx={{ color: '#666' }}
        >
          🗑️
        </IconButton>
      </Box>
      </Card>
       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span></span>
      </div>
    </>
  );
};

export default TodoItem;
