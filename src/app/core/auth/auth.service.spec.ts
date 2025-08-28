import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service'; // ajusta el path real
import { API_URL } from '../http/api.tokens';
import { UniversalStorage } from '../storage/universal.storage';

import type { ApiResponse, AuthResponse, LoginRequest, UserDTO } from '@app/domain/models';

// ---------------------- Test doubles ----------------------

/** Storage stub with spies; in-memory key-value store to simulate persistence */
function createStorageStub(initial?: Partial<Record<'user' | 'token', unknown>>) {
  const store: Record<string, unknown> = { ...(initial ?? {}) };
  return {
    get: vi.fn(<T,>(key: string) => (store[key] as T) ?? null),
    set: vi.fn((key: string, value: unknown) => { store[key] = value; }),
    remove: vi.fn((key: string) => { delete store[key]; }),
  } as unknown as UniversalStorage;
}

const API_BASE = 'https://api.test.local';

describe('AuthService (unit)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageStub: UniversalStorage;

  function configureTestBed(overrides?: {
    storage?: UniversalStorage;
    apiBase?: string;
  }) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // Angular’s official test backend for HttpClient
        { provide: API_URL, useValue: overrides?.apiBase ?? API_BASE },
        { provide: UniversalStorage, useValue: overrides?.storage ?? storageStub },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    storageStub = createStorageStub(); // fresh stub per test
    configureTestBed();
  });

  afterEach(() => {
    // Ensure that no unexpected / pending requests are left
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should initialize signals from storage and compute isLogged correctly', () => {
    // Arrange: reconfigure TestBed with pre-populated storage
    const user: UserDTO = { id: 1, name: 'Ana' } as any;
    const token = 'abc.123';
    const prepopulated = createStorageStub({ user, token });

    TestBed.resetTestingModule();
    configureTestBed({ storage: prepopulated });

    // Assert initial state from storage
    expect(service.user()).toEqual(user);
    expect(service.token()).toBe(token);
    expect(service.isLogged()).toBe(true);
  });

  it('login(): should POST /auth/login, update signals, and persist user/token in storage', () => {
    const payload: LoginRequest = { username: 'ana', password: 'secreta' } as any;

    // Act: call login; we subscribe here because the service returns an Observable
    let emitted: ApiResponse<AuthResponse> | undefined;
    service.login(payload).subscribe((res) => (emitted = res));

    // Assert request
    const req = httpMock.expectOne(`${API_BASE}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    // Reply with a successful response
    const mockUser: UserDTO = { id: 7, name: 'Ana' } as any;
    const mockToken = 'jwt-xyz';
    const apiResponse: ApiResponse<AuthResponse> = {
      status: 'ok',
      message: 'logged',
      data: { user: mockUser, token: mockToken },
    };

    req.flush(apiResponse);

    // Assert Observable emission
    expect(emitted).toEqual(apiResponse);

    // Signals reflect new auth state
    expect(service.user()).toEqual(mockUser);
    expect(service.token()).toBe(mockToken);
    expect(service.isLogged()).toBe(true);

    // Storage side-effects
    const s = storageStub as any;
    expect(s.set).toHaveBeenCalledWith('user', mockUser);
    expect(s.set).toHaveBeenCalledWith('token', mockToken);
  });

  it('login(): on server error, should NOT persist or change signals', () => {
    const payload: LoginRequest = { username: 'bad', password: 'wrong' } as any;

    // Subscribe capturing error
    let errorCaught: unknown | null = null;
    service.login(payload).subscribe({
      next: () => { /* no-op */ },
      error: (err) => (errorCaught = err),
    });

    const req = httpMock.expectOne(`${API_BASE}/auth/login`);
    expect(req.request.method).toBe('POST');

    // Simulate backend error
    req.flush({ status: 'error', message: 'invalid' }, { status: 401, statusText: 'Unauthorized' });

    // No side-effects to signals/storage on error
    expect(service.user()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.isLogged()).toBe(false);

    const s = storageStub as any;
    expect(s.set).not.toHaveBeenCalled();
    expect(errorCaught).toBeTruthy();
  });

  it('logout(): should clear signals and storage without HTTP requests', () => {
    // Preload success state via a prior login call
    service.login({ username: 'x', password: 'y' } as any).subscribe();
    const req = httpMock.expectOne(`${API_BASE}/auth/login`);
    req.flush({
      status: 'ok',
      message: 'logged',
      data: { user: { id: 2, name: 'Test' }, token: 'T' },
    } as ApiResponse<AuthResponse>);

    // Act
    service.logout();

    // Assert signals cleared
    expect(service.user()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.isLogged()).toBe(false);

    // Assert storage cleared
    const s = storageStub as any;
    expect(s.remove).toHaveBeenCalledWith('user');
    expect(s.remove).toHaveBeenCalledWith('token');

    // No extra HTTP
    httpMock.expectNone(() => true);
  });
});
