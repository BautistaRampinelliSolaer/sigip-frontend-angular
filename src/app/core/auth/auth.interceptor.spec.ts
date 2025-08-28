import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { authInterceptor } from './auth.interceptor';
import { API_URL } from '../http/api.tokens';
import { UniversalStorage } from '../storage/universal.storage';
import { AuthService } from '../auth/auth.service';

// --- Test doubles -----------------------------------------------------------
const API_BASE = 'https://api.test.local';

function createStorageStub(token: string | null) {
  return {
    get: vi.fn((key: string) => (key === 'token' ? (token as any) : null)),
    set: vi.fn(),
    remove: vi.fn(),
  } as unknown as UniversalStorage;
}

describe('authInterceptor (unit)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const routerMock = { url: '/', navigateByUrl: vi.fn() };
  const authMock = { logout: vi.fn() };

  function setup({ token }: { token: string | null }) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: API_BASE },
        { provide: UniversalStorage, useValue: createStorageStub(token) },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authMock },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    vi.clearAllMocks();
  }

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('adds Authorization for private endpoints when token is present', () => {
    setup({ token: 'abc.123' });

    http.get(`${API_BASE}/users`).subscribe();
    const req = httpMock.expectOne(`${API_BASE}/users`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc.123');
    req.flush({});
  });

  it('does NOT add Authorization for /auth/login (public)', () => {
    setup({ token: 'abc.123' });

    http.post(`${API_BASE}/auth/login`, { u: 'a', p: 'b' }).subscribe();
    const req = httpMock.expectOne(`${API_BASE}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({}); // public endpoint, no header
  });

  it('does NOT add Authorization when token is missing', () => {
    setup({ token: null });

    http.get(`${API_BASE}/projects`).subscribe();
    const req = httpMock.expectOne(`${API_BASE}/projects`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('on 401 triggers logout() and redirects to /login', () => {
    setup({ token: 'abc.123' });

    http.get(`${API_BASE}/me`).subscribe({
      next: () => fail('should not succeed'),
      error: () => void 0,
    });
    const req = httpMock.expectOne(`${API_BASE}/me`);
    req.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authMock.logout).toHaveBeenCalledTimes(1);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('on 403 triggers logout() and redirects to /login', () => {
    setup({ token: 'abc.123' });

    http.get(`${API_BASE}/admin`).subscribe({ error: () => void 0 });
    const req = httpMock.expectOne(`${API_BASE}/admin`);
    req.flush({ message: 'forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(authMock.logout).toHaveBeenCalledTimes(1);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('does NOT redirect on auth/** errors to avoid loop', () => {
    setup({ token: 'abc.123' });

    http.post(`${API_BASE}/auth/login`, { u: 'a', p: 'b' }).subscribe({ error: () => void 0 });
    const req = httpMock.expectOne(`${API_BASE}/auth/login`);
    req.flush({ message: 'bad' }, { status: 401, statusText: 'Unauthorized' });

    expect(authMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });
});
