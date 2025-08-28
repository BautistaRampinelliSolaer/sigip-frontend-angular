import { ProjectMiniDTO } from "..";

export interface DocumentDTO { 
    id: number; 
    code?: string; 
    name: string; 
    type?: string; 
    createdAt: string; 
    project: ProjectMiniDTO; 
    state?: string; 
}