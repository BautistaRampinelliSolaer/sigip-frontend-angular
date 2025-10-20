import { inject, Injectable } from '@angular/core';
import { LifecycleApi } from './lifecycle.api';
import { lifecycleDTO, createLifecycleRequest, ApiResponse } from '@app/domain/models';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@app/core/http/api.tokens';
import { unwrap } from '@app/infrastructure/helpers/unwrap';

Injectable({
  providedIn: 'root',
});
export class LifecycleApiHttp extends LifecycleApi {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL) + '/api/lifecyces';

  getAll(): Observable<lifecycleDTO[]> {
    return this.http.get<ApiResponse<lifecycleDTO[]>>(`${this.api}/getAll`).pipe(map(unwrap));
  }
  getById(id: number): Observable<lifecycleDTO> {
    return this.http.get<ApiResponse<lifecycleDTO>>(`${this.api}/${id}`).pipe(map(unwrap));
  }
  getByAssignedId(assignedId: number): Observable<lifecycleDTO[]> {
    return this.http
      .get<ApiResponse<lifecycleDTO[]>>(`${this.api}/ByAssigned/${assignedId}`)
      .pipe(map(unwrap));
  }
  create(createLifecycleRequest: createLifecycleRequest): Observable<lifecycleDTO> {
    return this.http
      .post<ApiResponse<lifecycleDTO>>(`${this.api}/create`, createLifecycleRequest)
      .pipe(map(unwrap));
  }
  update(updated: Partial<lifecycleDTO>): Observable<lifecycleDTO> {
    return this.http.put<ApiResponse<lifecycleDTO>>(`${this.api}/edit`, updated).pipe(map(unwrap));
  }
  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/delete/${id}`).pipe(map(unwrap));
  }
}
