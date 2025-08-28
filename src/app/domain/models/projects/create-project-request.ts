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