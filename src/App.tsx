import React from 'react';
import TodoList from './components/TodoList';
import {Box} from '@mui/material';

const App:React.FC=()=>{
  return(
    <div>
      <Box
        sx={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignitems:'center',
          height:'100vh',
          backgroundColor:'#f3f4f6',
        }}
      >
        <TodoList/>
      </Box>
    </div>
  );
};

export default App;
