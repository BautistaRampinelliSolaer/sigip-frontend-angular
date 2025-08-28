import { ObjectMiniDTO } from "../common/object-mini-dto";

export interface ProjectMiniDTO { 
    id: number; 
    name: string; 
    responsible?: ObjectMiniDTO; 
}