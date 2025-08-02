import { useEffect, useRef, useState, useCallback } from 'react';
import { Todo, ReminderSettings } from '../types/Todo';
import { scheduleReminder, clearReminder, requestNotificationPermission } from '../utils/notificationUtils';
import { calculateReminderTime } from '../utils/dateUtils';

interface UseReminderProps {
  todos: Todo[];
  onReminderSent?: (todoId: string) => void;
}

export const useReminder = ({ todos, onReminderSent }: UseReminderProps) => {
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: true,
    beforeMinutes: 30,
    type: 'browser'
  });
  
  const reminderTimers = useRef<Map<string, number>>(new Map());
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);

  // 通知許可の確認
  useEffect(() => {
    let isMounted = true;

    const checkPermission = async () => {
      try {
        const granted = await requestNotificationPermission();
        if (isMounted) {
          setNotificationPermission(granted);
        }
      } catch (error) {
        console.error('通知許可の確認に失敗しました:', error);
        if (isMounted) {
          setNotificationPermission(false);
        }
      }
    };
    
    if (reminderSettings.enabled && reminderSettings.type === 'browser') {
      checkPermission();
    }

    return () => {
      isMounted = false;
    };
  }, [reminderSettings.enabled, reminderSettings.type]);

  // 既存のタイマーをクリアする関数
  const clearAllTimers = useCallback(() => {
    const currentTimers = reminderTimers.current;
    currentTimers.forEach((timerId) => {
      clearReminder(timerId);
    });
    currentTimers.clear();
  }, []);

  // リマインダー送信後のコールバック
  const handleReminderSent = useCallback((todoId: string) => {
    // タイマーマップから削除
    reminderTimers.current.delete(todoId);
    
    // 親コンポーネントに通知
    if (onReminderSent) {
      onReminderSent(todoId);
    } else {
      console.log(`リマインダー送信済み: ${todoId}`);
    }
  }, [onReminderSent]);

  // 単一のタスクにリマインダーを設定する関数
  const scheduleReminderForTodo = useCallback((todo: Todo) => {
    if (!todo.dueDate) return;

    const reminderTime = calculateReminderTime(todo.dueDate, reminderSettings.beforeMinutes);
    
    // 過去の時間の場合はスケジュールしない
    if (reminderTime <= new Date()) {
      return;
    }

    const timerId = scheduleReminder(
      todo.text,
      reminderTime,
      () => handleReminderSent(todo.id)
    );

    if (timerId !== -1) {
      reminderTimers.current.set(todo.id, timerId);
    }
  }, [reminderSettings.beforeMinutes, handleReminderSent]);

  // リマインダーのスケジューリング
  useEffect(() => {
    // リマインダーが無効、またはブラウザ通知でない場合は何もしない
    if (!reminderSettings.enabled || reminderSettings.type !== 'browser') {
      clearAllTimers();
      return;
    }

    // 通知許可がない場合は何もしない
    if (!notificationPermission) {
      clearAllTimers();
      return;
    }

    // エフェクト開始時にタイマーのスナップショットを取得（ESLintエラー対策）
    const timersSnapshot = new Map(reminderTimers.current);

    // 既存のタイマーをクリア
    clearAllTimers();

    // リマインダー対象のタスクを取得
    const eligibleTodos = todos.filter(todo => 
      !todo.done && 
      todo.dueDate && 
      !todo.reminderSent
    );

    // 各タスクにリマインダーを設定
    eligibleTodos.forEach(scheduleReminderForTodo);

    // クリーンアップ関数でスナップショットを使用
    return () => {
      timersSnapshot.forEach((timerId) => {
        clearReminder(timerId);
      });
    };
  }, [
    todos, 
    reminderSettings.enabled, 
    reminderSettings.type, 
    reminderSettings.beforeMinutes,
    notificationPermission,
    clearAllTimers,
    scheduleReminderForTodo
  ]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // リマインダー設定を更新する関数
  const updateReminderSettings = useCallback((newSettings: Partial<ReminderSettings>) => {
    setReminderSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // 特定のタスクのリマインダーを手動でクリアする関数
  const clearReminderForTodo = useCallback((todoId: string) => {
    const timerId = reminderTimers.current.get(todoId);
    if (timerId) {
      clearReminder(timerId);
      reminderTimers.current.delete(todoId);
    }
  }, []);

  // アクティブなリマインダーの数を取得
  const activeReminderCount = reminderTimers.current.size;

  return {
    reminderSettings,
    updateReminderSettings,
    notificationPermission,
    clearReminderForTodo,
    activeReminderCount,
    clearAllTimers
  };
};