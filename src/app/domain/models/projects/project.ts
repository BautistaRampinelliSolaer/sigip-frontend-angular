import { ObjectMiniDTO } from "../common/object-mini-dto";
import { DocumentMiniDTO } from "../documents/document";

export interface ProjectDTO { 
    id: number; 
    code: string; 
    name: string;
    company: ObjectMiniDTO;
    plantCompany: ObjectMiniDTO;
    clientContact: ObjectMiniDTO;
    documents: Set<DocumentMiniDTO>;
    creationDate: string;
    folderPath: string;
    image: string;
    keyword: string;
    description: string;
    observations: Set<string>;
    profiles: string;
    modelingTechniques: string;
    standards: string;
    responsible?: ObjectMiniDTO; 
    state?: string; 
    budget: ObjectMiniDTO;
    corrector: ObjectMiniDTO;
    reviewer: ObjectMiniDTO;
    parentProject?: ObjectMiniDTO;
    type: string
}

export interface CreateProjectRequest {
    code: string;
    name: string;
    companyId?: number;
    documentIds?: number[];
    plantId?: number;
    folderPath?: string;
    image?: string;
    keyword?: string;
    description: string;
    observations?: string;
    profiles?: string;
    modelingTechniques?: string;
    standards: string;
    responsibleId: number;
    clientContactId?: number;
    state: string;
    budgetId?: number;
    budgetState?: string;
    correctorId?: number;
    reviewerId: number;
    parentProjectId?: number;
    type: string;
}

export interface ProjectMiniDTO { 
    id: number; 
    name: string; 
    responsible?: ObjectMiniDTO; 
}