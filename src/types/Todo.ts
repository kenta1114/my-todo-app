export interface Todo{
    id:number;
    text:string;
    category:string;
    done:boolean;
    priority: "LOW" | "MEDIUM" | "HIGH"; // Optional priority field
    urgent?:boolean;
    important?:boolean;
    createdAt: Date;
}