import {useEffect, useRef, useState} from 'react';
import { Todo, ReminderSettings } from '../types/Todo';
import { scheduleReminder, clearReminder, requestNotificationPermission } from '../utils/notificationUtils';
import { calculateReminderTime } from '../utils/dateUtils';

export const useReminder = (todos:Todo[])=>{
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: true,
    beforeMinutes: 30,
    type: 'browser'
  });

  const reminderTimers = useRef<Map<string, number>>(new Map());
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);

  // 通知許可の確認
  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestNotificationPermission();
      setNotificationPermission(granted);
    };
    
    if (reminderSettings.enabled && reminderSettings.type === 'browser') {
      checkPermission();
    }
  }, [reminderSettings.enabled, reminderSettings.type]);

  useEffect(()=>{
    reminderTimers.current.forEach((timerId) => {
      clearReminder(timerId);
    });
    reminderTimers.current.clear();

    if(!reminderSettings.enabled || reminderSettings.type !== 'browser'){
      return;
    }

    todos
      .filter(todo => !todo.done && todo.dueDate && !todo.reminderSent)
      .forEach(todo=>{
        if(todo.dueDate){
          const reminderTime = calculateReminderTime(todo.dueDate,reminderSettings.beforeMinutes);

          const timerId = scheduleReminder(
            todo.text,
            reminderTime,
            ()=>{
              updateReminderSent(todo.id);
            }
          );

          if(timerId !== -1){
            reminderTimers.current.set(todo.id,timerId);
          }
        }
      });

    return () =>{
      reminderTimers.current.forEach((timerId)=>{
        clearReminder(timerId);
      });
      reminderTimers.current.clear();
    };
  },[todos,reminderSettings]);

  const updateReminderSent = (todoId:string)=>{
    console.log(`リマインダー送信済み:${todoId}`);
  };

  const updateReminderSettings = (newSettings:Partial<ReminderSettings>) => { 
    setReminderSettings(prev => ({...prev, ...newSettings}));
  };

  return{
    reminderSettings,
    updateReminderSettings,
    notificationPermission
  };
};