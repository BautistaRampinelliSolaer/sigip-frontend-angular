import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { API_URL } from '../http/api.tokens';
import { ApiResponse, AuthResponse, LoginRequest, UserDTO } from '@app/domain/models';
import { UniversalStorage } from '../storage/universal.storage';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL);
  private readonly storage = inject(UniversalStorage);

  private readonly _user = signal<UserDTO | null>(this.storage.get<UserDTO>('user'));
  private readonly _token = signal<string | null>(this.storage.get<string>('token'));

  user = this._user.asReadonly();
  token = this._token.asReadonly();

  isLogged = computed(() => !!this._token());

  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/login`, payload)
      .pipe(tap(({ data }) => {
        this._user.set(data.user);
        this._token.set(data.token);
        this.storage.set('user', data.user);
        this.storage.set('token', data.token);
      }));
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
    this.storage.remove('user');
    this.storage.remove('token');
  }
}
