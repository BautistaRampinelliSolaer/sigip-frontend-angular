import { ObjectMiniDTO } from "../common/object-mini-dto";

export interface PlantCompanyDTO {
id: number;
name: string;
phone?: string;
email?: string;
country?: string;
city?: string;
company?: ObjectMiniDTO | null;
clientContacts?: ObjectMiniDTO[];
}


export interface CreatePlantCompanyRequest {
name: string;
phone?: string;
email?: string;
country?: string;
city?: string;
companyId?: number;
}