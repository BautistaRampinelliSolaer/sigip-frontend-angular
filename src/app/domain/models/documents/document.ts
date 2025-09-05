import { ProjectMiniDTO } from "../projects/project";

export interface DocumentDTO { 
    id: number; 
    code?: string; 
    name: string; 
    type?: string; 
    createdAt: string; 
    project: ProjectMiniDTO; 
    state?: string; 
}

export interface DocumentMiniDTO {
    
}

export interface CreateDocumentRequest {
    name: string;
    projectId: number;
    code?: string;
    executorsIds?: number[];
    responsibleId?: number;
    reviewerId?: number;
    type?: string;
    estimatedHours?: number;
    state?: string;
    origin?: string;
    folderPath?: string;
}