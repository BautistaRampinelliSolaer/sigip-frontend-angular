import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@app/core/http/api.tokens';
import { ApiResponse, CreateProjectRequest, ProjectDTO, ProjectMiniDTO } from '@app/domain/models';
import { ProjectsApi } from './projects.api';
import { map, Observable } from 'rxjs';
import { unwrap } from '@app/infrastructure/helpers/unwrap';

@Injectable({
  providedIn: 'root',
})
export class ProjectsApiHttp extends ProjectsApi {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL) + '/api/projects';

  getAll() {
    return this.http.get<ApiResponse<ProjectDTO[]>>(`${this.api}/getAll`).pipe(map(unwrap));
  }

  getAllMini() {
    return this.http.get<ApiResponse<ProjectMiniDTO[]>>(`${this.api}/getAllMini`).pipe(map(unwrap));
  }

  create(userId: number, payload: CreateProjectRequest) {
    return this.http
      .post<ApiResponse<ProjectDTO>>(`${this.api}/create/${userId}`, payload)
      .pipe(map(unwrap));
  }

  getById(projectId: number): Observable<ProjectDTO> {
    return this.http.get<ApiResponse<ProjectDTO>>(`${this.api}/${projectId}`).pipe(map(unwrap));
  }

  getByState(state: string): Observable<ProjectDTO[]> {
    return this.http
      .get<ApiResponse<ProjectDTO[]>>(`${this.api}/ByState/${state}`)
      .pipe(map(unwrap));
  }

  getByResponsible(responsibleId: number): Observable<ProjectDTO[]> {
    return this.http
      .get<ApiResponse<ProjectDTO[]>>(`${this.api}/ByResponsible/${responsibleId}`)
      .pipe(map(unwrap));
  }

  getByCode(code: string): Observable<ProjectDTO> {
    return this.http.get<ApiResponse<ProjectDTO>>(`${this.api}/ByCode/${code}`).pipe(map(unwrap));
  }

  edit(userId: number, payload: Partial<ProjectDTO>): Observable<ProjectDTO> {
    return this.http
      .put<ApiResponse<ProjectDTO>>(`${this.api}/edit/${userId}`, payload)
      .pipe(map(unwrap));
  }

  delete(userId: number, projectId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.api}/delete/${projectId}/${userId}`)
      .pipe(map(unwrap));
  }
}
