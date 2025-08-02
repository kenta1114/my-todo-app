export interface Todo{
    id:string;
    text:string;
    done:boolean;
    priority: "LOW" | "MEDIUM" | "HIGH"; // Optional priority field
    createdAt: Date;
    dueDate?:Date;
    reminderTime?:Date;
    isOverdue?:boolean;
    reminderSent?:boolean;
}

export interface ReminderSettings{
    enabled:boolean;
    beforeMinutes:number;
    type:"browser"| "email" | 'none';
}

export type DateStatus = 'normal'| 'warning' | 'overdue' | 'today';

