import { Company, CreateCompanyRequest } from "@app/domain/models";
import { Observable } from "rxjs";

export abstract class CompanyApi {
    abstract listAll(): Observable<Company[]>;
    abstract getById(id: number): Observable<Company>;
    abstract create(dto: CreateCompanyRequest): Observable<Company>;
    abstract update(id: number, dto: Partial<CreateCompanyRequest>): Observable<Company>;
    abstract delete(id: number): Observable<void>;
}