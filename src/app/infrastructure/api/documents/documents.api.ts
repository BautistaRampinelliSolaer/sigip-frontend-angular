import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiResponse, CreateDocumentRequest, DocumentDTO } from "@app/domain/models";
import { ENV } from "@core/config/environment-token";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DocumentsApi {
    private http = inject(HttpClient);
    private env = inject(ENV);
    private baseUrl = this.env.apiUrl + '/api/documents';

    getAll() {
        return this.http.get<ApiResponse<DocumentDTO[]>>(`${this.baseUrl}/getAll`)
            .pipe(map(response => response.data));
    }

    create(req: CreateDocumentRequest) {
        return this.http.post<ApiResponse<DocumentDTO>>(`${this.baseUrl}/create`, { ...req })
            .pipe(map(response => response.data));
    }
    
}