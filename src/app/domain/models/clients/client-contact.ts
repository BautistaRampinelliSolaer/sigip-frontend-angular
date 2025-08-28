import { ObjectMiniDTO } from "../common/object-mini-dto";

export interface ClientContactDTO {
id: number;
name: string;
email?: string;
phone?: string;
cellphone?: string;
number_intern?: string;
country?: string;
city?: string;
company?: ObjectMiniDTO | null;
plantCompany?: ObjectMiniDTO | null;
}


export interface CreateClientContactRequest {
name: string;
email?: string;
phone?: string;
cellphone?: string;
number_intern?: string;
country?: string;
city?: string;
companyId?: number;
plantCompanyId?: number;
}
