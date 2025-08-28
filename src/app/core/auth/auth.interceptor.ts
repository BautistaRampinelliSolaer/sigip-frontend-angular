import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { API_URL } from '../http/api.tokens';           
import { UniversalStorage } from '../storage/universal.storage';
import { AuthService } from '../auth/auth.service';

/** Returns true if the request should NOT receive the Authorization header. */
function isPublicEndpoint(req: HttpRequest<unknown>, apiBase: string): boolean {
  // Only scope to your backend base URL (avoid touching third-party calls)
  if (!req.url.startsWith(apiBase)) return true;

  // Extract path after API base and normalize
  const path = req.url.slice(apiBase.length).toLowerCase();
  // All auth/** are public
  return path.startsWith('/auth/');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBase = inject(API_URL);
  const storage = inject(UniversalStorage);
  const router = inject(Router);
  const auth = inject(AuthService);

  let request = req;

  // Attach bearer token unless it's a public endpoint
  if (!isPublicEndpoint(req, apiBase)) {
    const token = storage.get<string>('token');
    if (token && !req.headers.has('Authorization')) {
      request = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  }

  return next(request).pipe(
    catchError(err => {
      // Global auth handling: 401/403 → clear + redirect (avoid loop on auth/**)
      const status = err?.status as number | undefined;
      if ((status === 401 || status === 403) && !isPublicEndpoint(req, apiBase)) {
        // Centralize cleanup in the service
        auth.logout();
        // Optional: only redirect if not already on /login
        try {
          if (router.url !== '/login') router.navigateByUrl('/login');
        } catch {
          // Router may not be ready in rare test/bootstrap cases: ignore
        }
      }
      return throwError(() => err);
    })
  );
};
