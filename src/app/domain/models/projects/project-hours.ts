import { ObjectMiniDTO } from "../common/object-mini-dto";
import { ProjectMiniDTO } from "./project";

export interface projectHoursDTO {
    id: number;
    project: ProjectMiniDTO;
    user: ObjectMiniDTO;
    workedHours: number;
    workDate: string;
    description: string;
}

export interface createProjectHoursRequest {
    projectId: number;
    userId: number;
    workedHours: number;
    workDate: string;
    description: string;
}