import { inject, Injectable } from "@angular/core";
import { ClientContactApi } from "./client-contact.api";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "@app/core/http/api.tokens";
import { ApiResponse, ClientContactDTO, CreateClientContactRequest } from "@app/domain/models";
import { map, Observable } from "rxjs";
import { unwrap } from "@app/infrastructure/helpers/unwrap";

@Injectable({
    providedIn: 'root',
})
export class ClientContactHttpApi implements ClientContactApi {
    private readonly http = inject(HttpClient);
    private readonly base = inject(API_URL) + '/api/client-contacts';
    
    listAll(): Observable<ClientContactDTO[]> {
        return this.http.get<ApiResponse<ClientContactDTO[]>>(`${this.base}/all`)
            .pipe(map(unwrap));    
    }

    getById(id: number): Observable<ClientContactDTO> {
        return this.http.get<ApiResponse<ClientContactDTO>>(`${this.base}/${id}`)
            .pipe(map(unwrap));        
    }

    listByCompany(companyId: number): Observable<ClientContactDTO[]> {
        return this.http.get<ApiResponse<ClientContactDTO[]>>(`${this.base}/listByCompany/${companyId}`)
            .pipe(map(unwrap));    
    }

    listByPlantCompany(plantCompanyId: number): Observable<ClientContactDTO[]> {
        return this.http.get<ApiResponse<ClientContactDTO[]>>(`${this.base}/listByPlantCompany/${plantCompanyId}`)
            .pipe(map(unwrap));    
    }

    create(req: CreateClientContactRequest): Observable<ClientContactDTO> {
        return this.http.post<ApiResponse<ClientContactDTO>>(`${this.base}/create`, req)
            .pipe(map(unwrap));    
    }

    update(id: number, dto: Partial<CreateClientContactRequest>): Observable<ClientContactDTO> {
        const body = {id, ...dto};
        return this.http.put<ApiResponse<ClientContactDTO>>(`${this.base}/update`, body)
            .pipe(map(unwrap));    
    }

    delete(id: number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.base}/delete/${id}`)
            .pipe(map(unwrap));    
    }
}