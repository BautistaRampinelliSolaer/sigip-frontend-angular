import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_URL } from "@app/core/http/api.tokens";
import { PlantCompanyApi } from "./plant-company.api";
import { ApiResponse, CreatePlantCompanyRequest, PlantCompanyDTO } from "@app/domain/models";
import { map, Observable } from "rxjs";
import { unwrap } from "@app/infrastructure/helpers/unwrap";

@Injectable({
    providedIn: 'root',
})
export class PlantCompanyHttpApi implements PlantCompanyApi {
    private readonly http = inject(HttpClient);
    private readonly base = inject(API_URL) + '/api/plant-companies';

    listAll(): Observable<PlantCompanyDTO[]> {
        return this.http.get<ApiResponse<PlantCompanyDTO[]>>(`${this.base}/getAll`)
            .pipe(map(unwrap));    
    }

    getById(id: number): Observable<PlantCompanyDTO> {
        return this.http.get<ApiResponse<PlantCompanyDTO>>(`${this.base}/getById/${id}`)
            .pipe(map(unwrap));    
    }

    listByCompany(companyId: number): Observable<PlantCompanyDTO[]> {
        return this.http.get<ApiResponse<PlantCompanyDTO[]>>(`${this.base}/listByCompany/${companyId}`)
            .pipe(map(unwrap));
    }

    create(dto: CreatePlantCompanyRequest): Observable<PlantCompanyDTO> {
        return this.http.post<ApiResponse<PlantCompanyDTO>>(`${this.base}/create`, dto)
            .pipe(map(unwrap));    
    }
    
    update(id: number, dto: Partial<CreatePlantCompanyRequest>): Observable<PlantCompanyDTO> {
        const body = {id, ...dto};
        return this.http.put<ApiResponse<PlantCompanyDTO>>(`${this.base}/update`, body)
            .pipe(map(unwrap));    
    }

    delete(id: number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.base}/delete/${id}`)
            .pipe(map(unwrap));    
    }
}