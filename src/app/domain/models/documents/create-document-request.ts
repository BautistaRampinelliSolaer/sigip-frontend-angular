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