import { inject, Injectable } from "@angular/core";
import { CompanyApi } from "./company.api";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "@app/core/http/api.tokens";
import { ApiResponse, Company, CreateCompanyRequest } from "@app/domain/models";
import { map, Observable } from "rxjs";
import { unwrap } from "@app/infrastructure/helpers/unwrap";

@Injectable({
    providedIn: 'root',
})
export class CompanyHttpApi implements CompanyApi {
    private readonly http = inject(HttpClient);
    private readonly base = inject(API_URL) + '/api/companies';

    listAll(): Observable<Company[]> {
        return this.http.get<ApiResponse<Company[]>>(`${this.base}/all`)
            .pipe(map(unwrap));    
    }

    getById(id: number): Observable<Company> {
        return this.http.get<ApiResponse<Company>>(`${this.base}/${id}`)
            .pipe(map(unwrap));
    }

    create(dto: CreateCompanyRequest): Observable<Company> {
        return this.http.post<ApiResponse<Company>>(`${this.base}/create`, dto)
            .pipe(map(unwrap));    
    }

    update(id: number, dto: Partial<CreateCompanyRequest>): Observable<Company> {
        const body = {id, ...dto};
        return this.http.put<ApiResponse<Company>>(`${this.base}/update`, body)
            .pipe(map(unwrap));    
    }

    delete(id: number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.base}/delete/${id}`)
            .pipe(map(unwrap));    
    }
}