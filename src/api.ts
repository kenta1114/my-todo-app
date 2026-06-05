const BASE_URL = '';

const normalizeTodo = (todo:any)=>({
  ...todo,
  dueDate:todo.dueDate ? new Date(todo.dueDate):undefined,
  createdAt:new Date(todo.createdAt),
});

export const todoApi = {
  // 全件取得
  getAll:async()=>{
    const res = await fetch(`${BASE_URL}/todos`);
    const todos = await res.json();
    // dateの文字列をDateオブジェクトに変換
    return todos.map((todo:any)=>normalizeTodo(todo));
  },

  // 新規追加
  create:async(todo:any)=>{
    const res = await fetch(`${BASE_URL}/todos`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(todo),
    });
    return normalizeTodo(await res.json()); 
  },

  update:async(id:string, data:any)=>{
    const res = await fetch(`${BASE_URL}/todos/${id}`,{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data),
    });
    return normalizeTodo(await res.json()); 
  },

  delete:async(id:string)=>{
    await fetch(`${BASE_URL}/todos/${id}`,{
      method:'DELETE',
    });
  },
};