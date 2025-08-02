import { DateStatus } from '../types/Todo';

export const formatDate = (date:Date):string=>{
  return date.toLocaleString('ja-JP',{
    year:'numeric',
    month:'short',
    day:'numeric',
    hour:'2-digit',
    minute:'2-digit',
  });
};

export const formatDateShort = (date:Date):string=>{
  return date.toLocaleDateString('ja-JP',{
    month:'short',
    day:'numeric'
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isOverdue = (date:Date):boolean=>{
  const now = new Date();
  return date < now;
}

export const getDaysUntilDue = (dueDate:Date):number=>{
  const today = new Date();
  today.setHours(0,0,0,0);
  const due = new Date(dueDate);
  due.setHours(0,0,0,0);

  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime/(1000 * 60 * 60 * 24));
};

export const getDateStatus = (dueDate:Date):DateStatus=>{
  if(isOverdue(dueDate)) return 'overdue';
  if(isToday(dueDate)) return 'today';

  const daysUntil = getDaysUntilDue(dueDate);
  if (daysUntil<1) return 'warning'; 

  return 'normal';
}

export const getDateStatusColor = (status:DateStatus):string=>{
  switch(status){
    case 'overdue': return '#ef4444';  // 赤
    case 'today': return '#f59e0b';    // オレンジ
    case 'warning': return '#eab308';  // 黄色
    default: return '#6b7280';         // グレー
  }
}

export const getDateStatusBgColor = (status: DateStatus): string => {
  switch (status) {
    case 'overdue': return '#fef2f2';
    case 'today': return '#fffbeb';
    case 'warning': return '#fefce8';
    default: return '#f9fafb';
  }
};

export const calculateReminderTime = (dueDate: Date, beforeMinutes: number): Date => {
  const reminderTime = new Date(dueDate);
  reminderTime.setMinutes(reminderTime.getMinutes() - beforeMinutes);
  return reminderTime;
};

