import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { API_URL } from '@app/core/http/api.tokens';
import { unwrap } from '@app/infrastructure/helpers/unwrap';
import { ApiResponse, UserDTO, CreateUserRequest } from '@app/domain/models';

@Injectable({
  providedIn: 'root',
})
export class UsersApiHttp {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL) + '/api/users';

  listAll(): Observable<UserDTO[]> {
    return this.http.get<ApiResponse<UserDTO[]>>(`${this.api}/getAll`).pipe(map(unwrap));
  }

  getById(id: number): Observable<UserDTO> {
    return this.http.get<ApiResponse<UserDTO>>(`${this.api}/${id}`).pipe(map(unwrap));
  }

  getByUsername(username: string): Observable<UserDTO> {
    return this.http
      .get<ApiResponse<UserDTO>>(`${this.api}/ByUsername/${encodeURIComponent(username)}`)
      .pipe(map(unwrap));
  }

  create(payload: CreateUserRequest): Observable<UserDTO> {
    return this.http.post<ApiResponse<UserDTO>>(`${this.api}/create`, payload).pipe(map(unwrap));
  }

  update(id: number, payload: Partial<CreateUserRequest>): Observable<UserDTO> {
    return this.http.put<ApiResponse<UserDTO>>(`${this.api}/edit/${id}`, payload).pipe(map(unwrap));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/delete/${id}`).pipe(map(unwrap));
  }
}
