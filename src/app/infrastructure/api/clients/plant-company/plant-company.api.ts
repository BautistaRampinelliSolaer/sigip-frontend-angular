import { CreatePlantCompanyRequest, PlantCompanyDTO } from "@app/domain/models";
import { Observable } from "rxjs";

export abstract class PlantCompanyApi {
    abstract listAll(): Observable<PlantCompanyDTO[]>;
    abstract getById(id: number): Observable<PlantCompanyDTO>;
    abstract listByCompany(companyId: number): Observable<PlantCompanyDTO[]>;
    abstract create(dto: CreatePlantCompanyRequest): Observable<PlantCompanyDTO>;
    abstract update(id: number, dto: Partial<CreatePlantCompanyRequest>): Observable<PlantCompanyDTO>;
    abstract delete(id: number): Observable<void>;
}