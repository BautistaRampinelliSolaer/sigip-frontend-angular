import { ProjectHoursDTO, CreateProjectHoursRequest, ApiResponse } from '@app/domain/models';
import { map, Observable } from 'rxjs';
import { ProjectHoursApi } from './project-hours.api';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/core/http/api.tokens';
import { unwrap } from '@app/infrastructure/helpers/unwrap';

export class ProjectHoursHttpApi extends ProjectHoursApi {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL) + '/api/project-hours';

  getAll(): Observable<ProjectHoursDTO[]> {
    return this.http.get<ApiResponse<ProjectHoursDTO[]>>(`${this.api}/getAll`).pipe(map(unwrap));
  }
  getById(projectHoursId: number): Observable<ProjectHoursDTO> {
    return this.http
      .get<ApiResponse<ProjectHoursDTO>>(`${this.api}/${projectHoursId}`)
      .pipe(map(unwrap));
  }
  getByUserId(userId: number): Observable<ProjectHoursDTO[]> {
    return this.http
      .get<ApiResponse<ProjectHoursDTO[]>>(`${this.api}/ByUser/${userId}`)
      .pipe(map(unwrap));
  }
  getByProjectId(projectId: number): Observable<ProjectHoursDTO[]> {
    return this.http
      .get<ApiResponse<ProjectHoursDTO[]>>(`${this.api}/ByProject/${projectId}`)
      .pipe(map(unwrap));
  }
  create(createProjectHoursRequest: CreateProjectHoursRequest): Observable<ProjectHoursDTO> {
    return this.http
      .post<ApiResponse<ProjectHoursDTO>>(`${this.api}/create`, createProjectHoursRequest)
      .pipe(map(unwrap));
  }
  delete(projectHoursId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.api}/delete/${projectHoursId}`)
      .pipe(map(unwrap));
  }
}
