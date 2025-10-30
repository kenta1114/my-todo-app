import { useState } from 'react';
import { Card, Checkbox, Button, Chip, Box, TextField } from '@mui/material';


interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: Date;
}

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onUpdatePriority: (id: string, newPriority: "HIGH" | "MEDIUM" | "LOW") => void;
  onUpdateText: (id: string, newText: string) => void;
  onUpdateDueDate?: (id: string, dueDate: Date | undefined) => void;
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
  onUpdateText,
  onUpdateDueDate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const priorityConfig = PRIORITY_CONFIG[todo.priority];

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateText(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: 'none',
        marginBottom: '8px',
        borderColor: '#e0e0e0',
        backgroundColor: todo.done ? '#f9fafb' : 'white',
        gap: 2
      }}
    >
      {/* チェックボックス */}
      <Checkbox
        checked={todo.done}
        onChange={() => onToggleDone(todo.id)}
        color="default"
        disabled={isEditing}
      />

      {/* 優先度チップ */}
      {!isEditing && (
        <Chip
          label={priorityConfig.label}
          size="small"
          sx={{
            backgroundColor: priorityConfig.color + '20',
            color: priorityConfig.color,
            fontWeight: 'bold',
            fontSize: '11px',
            flexShrink: 0
          }}
        />
      )}

      {/* タスクテキスト or 編集フィールド */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {isEditing ? (
          <TextField
            fullWidth
            size="small"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
        ) : (
          <Box
            sx={{
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#9ca3af' : '#1f2937',
              fontSize: '14px',
              wordBreak: 'break-word'
            }}
          >
            {todo.text}
          </Box>
        )}
      </Box>

      {/* ボタン群 */}
      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        {isEditing ? (
          <>
            <Button onClick={handleSave} size="small" variant="contained" color="primary">
              保存
            </Button>
            <Button onClick={handleCancel} size="small" variant="outlined" color="secondary">
              キャンセル
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size="small"
            variant="outlined"
            disabled={todo.done}
          >
            編集
          </Button>
        )}

        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => onDelete(todo.id)}
        >
          削除
        </Button>
      </Box>
    </Card>
  ); 
};

export default TodoItem;
