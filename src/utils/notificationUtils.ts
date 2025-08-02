export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('このブラウザは通知をサポートしていません');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }
};

export const scheduleReminder = (
  taskText: string,
  reminderTime: Date,
  callback?: () => void
): number => {
  const now = new Date();
  const delay = reminderTime.getTime() - now.getTime();

  if (delay <= 0) {
    // 既に過ぎている場合は即座に通知
    showNotification('期限が過ぎています', {
      body: `タスク: ${taskText}`,
      tag: 'overdue-reminder'
    });
    callback?.();
    return -1;
  }

  return window.setTimeout(() => {
    showNotification('タスクの期限が近づいています', {
      body: `タスク: ${taskText}`,
      tag: 'task-reminder'
    });
    callback?.();
  }, delay);
};

export const clearReminder = (timerId: number): void => {
  if (timerId !== -1) {
    clearTimeout(timerId);
  }
};