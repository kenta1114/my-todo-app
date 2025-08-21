import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import { Todo } from '../types/Todo';

interface SettingsProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const Settings: React.FC<SettingsProps> = ({ todos, setTodos }) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // データエクスポート機能
  const handleExport = () => {
    try {
      let dataToExport: string;
      let fileName: string;
      let mimeType: string;

      if (exportFormat === 'json') {
        dataToExport = JSON.stringify(todos, null, 2);
        fileName = `todos_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        // CSV形式
        const csvHeaders = 'ID,タスク,完了状態,優先度,作成日,期限日\n';
        const csvData = todos.map(todo =>
          `"${todo.id}","${todo.text}","${todo.done ? '完了' : '未完了'}","${todo.priority}","${todo.createdAt?.toISOString() || ''}","${todo.dueDate?.toISOString() || ''}"`
        ).join('\n');
        dataToExport = csvHeaders + csvData;
        fileName = `todos_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      const blob = new Blob([dataToExport], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportDialogOpen(false);
      setNotification({ message: 'データをエクスポートしました', type: 'success' });
    } catch (error) {
      setNotification({ message: 'エクスポートに失敗しました', type: 'error' });
    }
  };

  // データインポート機能
  const handleImport = () => {
    try {
      const importedTodos: Todo[] = JSON.parse(importText);

      // データ形式の検証
      if (!Array.isArray(importedTodos)) {
        throw new Error('Invalid format');
      }

      // 日付文字列をDateオブジェクトに変換
      const processedTodos = importedTodos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date(),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));

      setTodos(processedTodos);
      setImportDialogOpen(false);
      setImportText('');
      setNotification({ message: 'データをインポートしました', type: 'success' });
    } catch (error) {
      setNotification({ message: 'インポートに失敗しました。正しいJSON形式で入力してください', type: 'error' });
    }
  };

  //全データクリア
  const handleClearAll = () => {
    setTodos([]);
    setClearDialogOpen(false);
    setNotification({ message: '全てのデータを削除しました', type: 'success' });
  };

  // 完了済みタスクのみクリア
  const handleClearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.done));
    setNotification({ message: '完了済みタスクを削除しました', type: 'success' });
  };

  // 期限切れタスクのみクリア
  const handleClearOverdue = () => {
    const now = new Date();
    setTodos(prev => prev.filter(todo => !(todo.dueDate && todo.dueDate < now && !todo.done)));
    setNotification({ message: '期限切れタスクを削除しました', type: 'success' });
  };

  // サンプルデータの追加
  const handleAddSampleData = () => {
    const sampleTodos: Todo[] = [
      {
        id: Date.now().toString() + '_1',
        text: '📧 重要なメールの返信',
        done: false,
        priority: 'HIGH',
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2時間後
        reminderSent: false
      },
      {
        id: Date.now().toString() + '_2',
        text: '📚 プレゼン資料の準備',
        done: false,
        priority: 'MEDIUM',
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明日
        reminderSent: false
      },
      {
        id: Date.now().toString() + '_3',
        text: '☕ コーヒーを買いに行く',
        done: false,
        priority: 'LOW',
        createdAt: new Date(),
        reminderSent: false
      },
      {
        id: Date.now().toString() + '_4',
        text: '✅ 完了済みのサンプルタスク',
        done: true,
        priority: 'MEDIUM',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        reminderSent: false
      }
    ];

    setTodos(prev => [...prev, ...sampleTodos]);
    setNotification({ message: 'サンプルデータを追加しました', type: 'success' });
  };

  const completedCount = todos.filter(t => t.done).length;
  const overdueCount = todos.filter(t => t.dueDate && t.dueDate < new Date() && !t.done).length;

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: 2 }}>
      {/* 通知 */}
      {notification && (
        <Alert
          severity={notification.type}
          sx={{ marginBottom: 3 }}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      {/* ヘッダー */}
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold', color: '#1f2937' }}>
        ⚙️ 設定
      </Typography>

      <Grid container spacing={3}>
        {/* データ管理 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                💾 データ管理
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setExportDialogOpen(true)}
                  sx={{
                    backgroundColor: '#3b82f6',
                    '&:hover': { backgroundColor: '#2563eb' },
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  📤 データをエクスポート
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setImportDialogOpen(true)}
                  sx={{
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  📥 データをインポート
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleAddSampleData}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { borderColor: '#059669', backgroundColor: '#f0fdf4' },
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  🎯 サンプルデータを追加
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* データ統計 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                📊 データ統計
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">総タスク数</Typography>
                  <Chip label={todos.length} color="primary" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">完了済み</Typography>
                  <Chip label={completedCount} sx={{ backgroundColor: '#10b981', color: 'white' }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">未完了</Typography>
                  <Chip label={todos.length - completedCount} sx={{ backgroundColor: '#f59e0b', color: 'white' }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">期限切れ</Typography>
                  <Chip label={overdueCount} sx={{ backgroundColor: '#ef4444', color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* データクリア */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#dc2626' }}>
                🗑️ データ削除
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClearCompleted}
                  disabled={completedCount === 0}
                  sx={{
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': { borderColor: '#d97706', backgroundColor: '#fffbeb' },
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  ✅ 完了済みタスクを削除 ({completedCount}件)
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleClearOverdue}
                  disabled={overdueCount === 0}
                  sx={{
                    borderColor: '#dc2626',
                    color: '#dc2626',
                    '&:hover': { borderColor: '#b91c1c', backgroundColor: '#fef2f2' },
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  ⏰ 期限切れタスクを削除 ({overdueCount}件)
                </Button>

                <Divider sx={{ margin: '16px 0' }} />

                <Button
                  variant="contained"
                  onClick={() => setClearDialogOpen(true)}
                  disabled={todos.length === 0}
                  sx={{
                    backgroundColor: '#dc2626',
                    '&:hover': { backgroundColor: '#b91c1c' },
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  🚨 全てのデータを削除
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* アプリ情報 */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                ℹ️ アプリ情報
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>アプリ名:</strong> Advanced Todo App
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>バージョン:</strong> 1.0.0
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>機能:</strong> タスク管理、期限設定、リマインダー、統計分析
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>データ保存:</strong> ブラウザのローカルストレージ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* エクスポートダイアログ */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>データをエクスポート</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            タスクデータをファイルとしてダウンロードします。
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>エクスポート形式</InputLabel>
            <Select
              value={exportFormat}
              label="エクスポート形式"
              onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
            >
              <MenuItem value="json">JSON形式 (.json)</MenuItem>
              <MenuItem value="csv">CSV形式 (.csv)</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary">
            {exportFormat === 'json'
              ? 'JSON形式では全てのデータを保持できます（インポート可能）'
              : 'CSV形式では表計算ソフトで開くことができます'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleExport} variant="contained">エクスポート</Button>
        </DialogActions>
      </Dialog>

      {/* インポートダイアログ */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>データをインポート</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            JSON形式のデータを貼り付けてください。現在のデータは上書きされます。
          </Typography>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="JSONデータをここに貼り付けてください..."
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="caption" color="textSecondary">
            ⚠️ 注意: インポートすると現在のデータは完全に置き換えられます。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleImport} variant="contained" disabled={!importText.trim()}>
            インポート
          </Button>
        </DialogActions>
      </Dialog>

      {/* 全削除確認ダイアログ */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle sx={{ color: '#dc2626' }}>⚠️ 確認</DialogTitle>
        <DialogContent>
          <Typography>
            全てのタスクデータを削除します。この操作は元に戻せません。
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            削除対象: {todos.length}件のタスク
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleClearAll} variant="contained" color="error">
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Settings;