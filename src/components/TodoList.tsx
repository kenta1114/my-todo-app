import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography
} from '@mui/material';
import TodoItem from './TodoItem';
import DatePicker from './DatePicker';
import { Todo } from '../types/Todo';
import { useReminder } from '../hooks/useReminder';
import { isOverdue, getDateStatus } from '../utils/dateUtils';

const PRIORITY_CONFIG = {
  HIGH: { label: '高', color: '#ef4444', bgColor: '#fef2f2' },
  MEDIUM: { label: '中', color: '#f59e0b', bgColor: '#fffbeb' },
  LOW: { label: '低', color: '#10b981', bgColor: '#f0fdf4' }
};

type TodoListProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}


const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  // const [searchKeyword, setSearchKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  // const [newTask, setNewTask] = useState("");
  const [newTask, setNewTask] = useState("");
  // const [priority, setPriority] = useState<Todo['priority']>("MEDIUM");
  const [priority, setPriority] = useState<Todo['priority']>("MEDIUM");
  // const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();

  // const { reminderSettings, updateReminderSettings, notificationPermission } = useReminder({ todos });
  const { reminderSettings, updateReminderSettings, notificationPermission } = useReminder({ todos });

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTask,
      done: false,
      priority: priority,
      createdAt: new Date(),
      dueDate: newTaskDueDate,
      reminderSent: false
    };

    setTodos([...todos, newTodo]);
    setNewTask("");
    setNewTaskDueDate(undefined);
  };

  const handleDelete = (taskId: string) => {
    setTodos(todos.filter(task => task.id !== taskId));
  }

  const toggleDone = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }


  const updatePriority = (id: string, newPriority: "HIGH" | "MEDIUM" | "LOW") => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  }

  const sortAndFilterTodos = () => {
    let filtered = todos
      .filter(todo =>
        todo.text.toLowerCase().includes(searchKeyword.toLowerCase())
      );

    // 期限切れ > 優先度 > 期限日 の順でソート
    return filtered.sort((a, b) => {
      // 期限切れのタスクを最優先
      if (a.dueDate && b.dueDate) {
        const aOverdue = isOverdue(a.dueDate);
        const bOverdue = isOverdue(b.dueDate);
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
      }

      // 優先度でソート
      const priorityOrder = { "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // 期限日でソート（早い順）
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return 0;
    });
  };

  // 統計計算
  const priorityStats = {
    HIGH: todos.filter(t => t.priority === 'HIGH' && !t.done).length,
    MEDIUM: todos.filter(t => t.priority === 'MEDIUM' && !t.done).length,
    LOW: todos.filter(t => t.priority === 'LOW' && !t.done).length,
  };

  const deadlineStats = {
    overdue: todos.filter(t => !t.done && t.dueDate && isOverdue(t.dueDate)).length,
    today: todos.filter(t => !t.done && t.dueDate && getDateStatus(t.dueDate) === 'today').length,
    upcoming: todos.filter(t => !t.done && t.dueDate && getDateStatus(t.dueDate) === 'warning').length,
  };

  const filteredTodos = sortAndFilterTodos();

  const updateTaskText = (id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const updateTaskDueDate = (id: string, dueDate: Date | undefined) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, dueDate } : todo
      )
    );
  };

  return (
    <div>
      <Box sx={{ width: "600px", margin: "0 auto", padding: "20px" }}>

        {/* 統計表示 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
            タスク統計
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* 優先度統計 */}
            {Object.entries(priorityStats).map(([key, count]) => (
              <Box
                key={key}
                sx={{
                  textAlign: 'center',
                  padding: 1.5,
                  borderRadius: 2,
                  backgroundColor: PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].bgColor,
                  minWidth: 70
                }}
              >
                <Box sx={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].color
                }}>
                  {count}
                </Box>
                <Box sx={{ fontSize: '11px', marginTop: 0.5 }}>
                  {PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG].label}優先度
                </Box>
              </Box>
            ))}

            {/* 期限統計 */}
            <Box sx={{ textAlign: 'center', padding: 1.5, borderRadius: 2, backgroundColor: '#fef2f2', minWidth: 70 }}>
              <Box sx={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                {deadlineStats.overdue}
              </Box>
              <Box sx={{ fontSize: '11px', marginTop: 0.5 }}>期限切れ</Box>
            </Box>

            <Box sx={{ textAlign: 'center', padding: 1.5, borderRadius: 2, backgroundColor: '#fffbeb', minWidth: 70 }}>
              <Box sx={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                {deadlineStats.today}
              </Box>
              <Box sx={{ fontSize: '11px', marginTop: 0.5 }}>今日期限</Box>
            </Box>
          </Box>
        </Box>

        {/* リマインダー設定 */}
        <Box sx={{
          backgroundColor: '#f8fafc',
          padding: 2,
          borderRadius: 2,
          marginBottom: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <FormControlLabel
            control={
              <Switch
                checked={reminderSettings.enabled}
                onChange={(e) => updateReminderSettings({ enabled: e.target.checked })}
              />
            }
            label="リマインダー"
          />

          {reminderSettings.enabled && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>リマインド</InputLabel>
              <Select
                value={reminderSettings.beforeMinutes}
                label="リマインド"
                onChange={(e) => updateReminderSettings({ beforeMinutes: Number(e.target.value) })}
              >
                <MenuItem value={5}>5分前</MenuItem>
                <MenuItem value={15}>15分前</MenuItem>
                <MenuItem value={30}>30分前</MenuItem>
                <MenuItem value={60}>1時間前</MenuItem>
                <MenuItem value={1440}>1日前</MenuItem>
              </Select>
            </FormControl>
          )}

          {!notificationPermission && reminderSettings.enabled && (
            <Typography variant="caption" color="error">
              通知許可が必要です
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="検索..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />

        {/* 新しいタスク追加 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
            新しいタスクを追加
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="新しいタスクを追加"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>優先度</InputLabel>
                <Select
                  value={priority}
                  label="優先度"
                  onChange={(e) => setPriority(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                >
                  <MenuItem value="HIGH">高</MenuItem>
                  <MenuItem value="MEDIUM">中</MenuItem>
                  <MenuItem value="LOW">低</MenuItem>
                </Select>
              </FormControl>

              <DatePicker
                dueDate={newTaskDueDate}
                onDateChange={setNewTaskDueDate}
                label="期限日時"
              />

              <Button variant="contained" color="primary" onClick={addTask}>
                追加
              </Button>
            </Box>
          </Box>
        </Box>
        
        {/* タスクリストの表示 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
            タスクリスト
          </Typography>

          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onToggleDone={toggleDone}
                onUpdatePriority={updatePriority}
                onUpdateText={updateTaskText}
                onUpdateDueDate={updateTaskDueDate}
              />
            ))
          ) : (
            <p>タスクが見つかりませんでした</p>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default TodoList;
