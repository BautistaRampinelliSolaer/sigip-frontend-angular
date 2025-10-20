import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { ApiResponse, AuthResponse, LoginRequest, UserDTO } from '@app/domain/models';

/**
 * Mock de AuthService. Mantiene exactamente la misma API pública:
 * - signals: user, token
 * - computed: isLogged
 * - métodos: login(payload), logout()
 */
@Injectable({ providedIn: 'root' })
export class AuthServiceMock {
  // Estado en memoria (opcional: podrías persistir en sessionStorage/localStorage si querés)
  private readonly _user = signal<UserDTO | null>(null);
  private readonly _token = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLogged = computed(() => !!this._token());

  /**
   * Lógica de login simulada:
   * - acepta cualquier user/pass no vacíos y devuelve un token fake
   * - si querés validar credenciales específicas, agregá una condición y devolvé throwError
   */
  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    const { username, password } = payload ?? {};
    if (!username || !password) {
      return throwError(() => new Error('Credenciales inválidas'));
    }

    const fakeUser: UserDTO = {
      id: 1,
      username,
      name: 'Usuario',
      lastname: 'Demo',
      workingHours: 40,
      email: `${username}@demo.local`,
      role: 'admin',
      profilePhoto: ''
    };

    const fakeToken = 'mock-token-123';

    const response: ApiResponse<AuthResponse> = {
      status: 'OK',
      message: 'Logged (mock)',
      data: { token: fakeToken, user: fakeUser }
    };

    this.applySession(response.data);
    // “Simula red” con delay corto para no romper UX
    return of(response).pipe(
      delay(200),
      // seteo de estado como hace tu servicio real
      // (guardás en signals para que guards/interceptors lo vean)
      // Notá: acá no usamos HttpClient => tu interceptor no interviene
    );
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
  }

  /** Tip: llamá esto donde consumas login() para reflejar el seteo, así:
   *  auth.login(...).subscribe(({data}) => auth.applySession(data))
   *  o podés aplicarlo dentro del login() si preferís.
   */
  applySession(data: AuthResponse) {
    this._user.set(data.user);
    this._token.set(data.token);
  }
}
