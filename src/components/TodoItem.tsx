import { useState } from 'react';
import {
  Card, CardContent, Checkbox, Typography,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField
} from '@mui/material';
import { formatDate, getDateStatus, getDateStatusColor } from '../utils/dateUtils';
import DatePicker from './DatePicker';

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
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(todo.dueDate);
  const [editPriority, setEditPriority] = useState<"HIGH" | "MEDIUM" | "LOW">(todo.priority);

  const priorityConfig = PRIORITY_CONFIG[todo.priority];

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateText(todo.id, editText.trim());
      onUpdatePriority(todo.id, editPriority);
      if (onUpdateDueDate) {
        onUpdateDueDate(todo.id, editDueDate);
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDueDate(todo.dueDate);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
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
      }}
    >
      <Checkbox
        checked={todo.done}
        onChange={() => onToggleDone(todo.id)}
        color="default"
        disabled={isEditing}
      />

      <CardContent sx={{ padding: '0', flexGrow: 1, marginLeft: 1 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              size="small"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              fullWidth
              placeholder="タスクを入力..."
            />
            <DatePicker
              dueDate={editDueDate}
              onDateChange={setEditDueDate}
              label="期限日時"
              size="small"
            />
            <FormControl size="small" fullWidth>
              <Select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
              >
                <MenuItem value="HIGH">高</MenuItem>
                <MenuItem value="MEDIUM">中</MenuItem>
                <MenuItem value="LOW">低</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Arial',
                color: todo.done ? '#9ca3af' : '#333',
                textDecoration: todo.done ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </Typography>
            {todo.dueDate && (
              <Typography
                variant="caption"
                sx={{
                  color: getDateStatusColor(getDateStatus(todo.dueDate)),
                  fontSize: '0.75rem',
                  marginTop: 0.5,
                  display: 'block'
                }}
              >
                期限: {formatDate(todo.dueDate)}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {!isEditing && (
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
        )}

        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="small" variant="contained" color="primary">
                保存
              </Button>
              <Button onClick={handleCancel} size="small" variant="outlined">
                取消
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
        </Box>

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
