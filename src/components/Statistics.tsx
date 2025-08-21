import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Todo } from '../types/Todo';
import { isOverdue, getDateStatus } from '../utils/dateUtils';

interface StatisticsProps {
  todos: Todo[];
}

const Statistics: React.FC<StatisticsProps> = ({ todos }) => {

  // 基本統計の計算
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.done).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // 優先度別統計
  const priorityStats = {
    HIGH: {
      total: todos.filter(t => t.priority === 'HIGH').length,
      completed: todos.filter(t => t.priority === 'HIGH' && t.done).length,
      pending: todos.filter(t => t.priority === 'HIGH' && !t.done).length,
    },
    MEDIUM: {
      total: todos.filter(t => t.priority === 'MEDIUM').length,
      completed: todos.filter(t => t.priority === 'MEDIUM' && t.done).length,
      pending: todos.filter(t => t.priority === 'MEDIUM' && !t.done).length,
    },
    LOW: {
      total: todos.filter(t => t.priority === 'LOW').length,
      completed: todos.filter(t => t.priority === 'LOW' && t.done).length,
      pending: todos.filter(t => t.priority === 'LOW' && !t.done).length,
    },
  };

  // 期限に関する統計
  const overdueCount = todos.filter(t => !t.done && t.dueDate && isOverdue(t.dueDate)).length;

  // 最近の活動
  const recentCompletedTasks = todos
    .filter(t => t.done)
    .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
    .slice(0, 5);

  const urgentTasks = todos
    .filter(t => !t.done && t.dueDate && (isOverdue(t.dueDate) || getDateStatus(t.dueDate) === 'today'))
    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
    .slice(0, 5);

  const PRIORITY_CONFIG = {
    HIGH: { label: '高', color: '#ef4444' },
    MEDIUM: { label: '中', color: '#f59e0b' },
    LOW: { label: '低', color: '#10b981' }
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: 2 }}>
      {/* ヘッダー */}
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold', color: '#1f2937' }}>
        📊 統計・分析
      </Typography>

      <Grid container spacing={3}>
        {/* 基本統計カード */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                📈 全体概要
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', padding: 2, backgroundColor: '#eff6ff', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                      {totalTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>総タスク数</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', padding: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                      {completedTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>完了済み</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', padding: 2, backgroundColor: '#fef3c7', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                      {pendingTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>未完了</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', padding: 2, backgroundColor: '#fef2f2', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ef4444' }}>
                      {overdueCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>期限切れ</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* 完了率 */}
              <Box sx={{ marginTop: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: '600' }}>完了率</Typography>
                  <Typography variant="body2" sx={{ fontWeight: '600' }}>
                    {completionRate.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: completionRate >= 70 ? '#10b981' : completionRate >= 40 ? '#f59e0b' : '#ef4444',
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 緊急タスク */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#ef4444' }}>
                🚨 緊急タスク
              </Typography>
              {urgentTasks.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {urgentTasks.map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        padding: 2,
                        backgroundColor: '#fef2f2',
                        borderRadius: 2,
                        border: '1px solid #fecaca'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: '600', marginBottom: 0.5 }}>
                        {task.text}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          size="small"
                          label={PRIORITY_CONFIG[task.priority].label}
                          sx={{
                            backgroundColor: PRIORITY_CONFIG[task.priority].color,
                            color: 'white',
                            fontSize: '11px'
                          }}
                        />
                        {task.dueDate && (
                          <Typography variant="caption" sx={{ color: '#ef4444', fontSize: '11px' }}>
                            {isOverdue(task.dueDate) ? '期限切れ' : '今日期限'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                  緊急タスクはありません ✅
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 優先度別統計 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                🎯 優先度別統計
              </Typography>

              {Object.entries(priorityStats).map(([priority, stats]) => {
                const priorityKey = priority as keyof typeof PRIORITY_CONFIG;
                const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

                return (
                  <Box key={priority} sx={{ marginBottom: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          size="small"
                          label={PRIORITY_CONFIG[priorityKey].label}
                          sx={{
                            backgroundColor: PRIORITY_CONFIG[priorityKey].color,
                            color: 'white',
                            fontWeight: '600'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: '600' }}>
                          優先度
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {stats.completed}/{stats.total} ({completionRate.toFixed(0)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={completionRate}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#f3f4f6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: PRIORITY_CONFIG[priorityKey].color,
                          borderRadius: 3,
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* 最近完了したタスク */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#10b981' }}>
                ✅ 最近完了したタスク
              </Typography>
              {recentCompletedTasks.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recentCompletedTasks.map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        padding: 2,
                        backgroundColor: '#f0fdf4',
                        borderRadius: 2,
                        border: '1px solid #bbf7d0'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: '500',
                          textDecoration: 'line-through',
                          color: '#6b7280',
                          marginBottom: 0.5
                        }}
                      >
                        {task.text}
                      </Typography>
                      <Chip
                        size="small"
                        label={PRIORITY_CONFIG[task.priority].label}
                        sx={{
                          backgroundColor: PRIORITY_CONFIG[task.priority].color + '40',
                          color: PRIORITY_CONFIG[task.priority].color,
                          fontSize: '11px'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                  完了したタスクはまだありません
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Statistics;