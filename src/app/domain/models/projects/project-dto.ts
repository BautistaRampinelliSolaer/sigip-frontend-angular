import { ObjectMiniDTO } from "..";

export interface ProjectDTO { 
    id: number; 
    code: string; 
    name: string; 
    creationDate: string; 
    state?: string; 
    responsible?: ObjectMiniDTO; 
}