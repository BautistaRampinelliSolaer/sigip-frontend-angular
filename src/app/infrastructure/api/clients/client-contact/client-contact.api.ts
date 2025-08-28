import { ClientContactDTO, CreateClientContactRequest } from "@app/domain/models";
import { Observable } from "rxjs";

export abstract class ClientContactApi {
    abstract listAll(): Observable<ClientContactDTO[]>;
    abstract getById(id: number): Observable<ClientContactDTO>;
    abstract listByCompany(companyId: number): Observable<ClientContactDTO[]>;
    abstract listByPlantCompany(plantCompanyId: number): Observable<ClientContactDTO[]>;
    abstract create(dto: CreateClientContactRequest): Observable<ClientContactDTO>;
    abstract update(id: number, dto: Partial<CreateClientContactRequest>): Observable<ClientContactDTO>;
    abstract delete(id: number): Observable<void>;
}