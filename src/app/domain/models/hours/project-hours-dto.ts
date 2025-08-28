import { ObjectMiniDTO } from "../common/object-mini-dto";
import { ProjectMiniDTO } from "../projects/project-mini-dto";

export interface ProjectHoursDTO { 
    id: number; 
    project: ProjectMiniDTO; 
    user: ObjectMiniDTO; 
    workedHours: number; 
    workDate: string; 
    description?: string; 
}