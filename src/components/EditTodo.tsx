import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Todo } from "../types/Todo";

type EditTodoProps = {
  todos: Todo[];
  updateTaskText: (id: string, newText: string) => void;
};

const EditTodo: React.FC<EditTodoProps> = ({ todos, updateTaskText }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const todo = todos.find(t => t.id === id);
  const [text, setText] = useState(todo?.text || "");

  if (!todo) {
    return <p>タスクが見つかりません</p>;
  }

  const handleSave = () => {
    updateTaskText(todo.id, text);
    navigate("/"); // 保存後にトップページへ戻る
  };

  return (
    <div>
      <h2>タスクを編集</h2>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSave}>保存</button>
    </div>
  );
};

export default EditTodo;