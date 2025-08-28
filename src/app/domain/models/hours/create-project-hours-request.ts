export interface CreateProjectHoursRequest { 
    projectId: number; 
    userId: number; 
    workedHours: number; 
    workDate: string; 
    description?: string; 
}