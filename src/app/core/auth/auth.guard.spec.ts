import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { Location } from '@angular/common';
import { authGuard, loginBlockGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Component({ template: '<p>Home</p>' })
class HomeCmp {}

@Component({ template: '<p>Private</p>' })
class PrivateCmp {}

@Component({ template: '<p>Login</p>' })
class LoginCmp {}

describe('authGuard & loginBlockGuard (Angular 20 + Vitest)', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let location: Location;

  const authMock = { isLogged: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authMock },
        provideRouter([
          { path: '', component: HomeCmp },
          { path: 'login', component: LoginCmp, canMatch: [loginBlockGuard] },
          { path: 'private', component: PrivateCmp, canMatch: [authGuard] },
          { path: 'projects/:id/edit', component: PrivateCmp, canMatch: [authGuard] },
          { path: '**', redirectTo: '' },
        ]),
        provideLocationMocks(),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    harness = await RouterTestingHarness.create();
  });

  it('allows access to /private when isLogged()=true', async () => {
    authMock.isLogged.mockReturnValueOnce(true);

    await harness.navigateByUrl('/private');
    expect(location.path()).toBe('/private');
    expect(harness.routeNativeElement?.textContent).toContain('Private');
  });

  it('redirects to /login with returnUrl when isLogged()=false', async () => {
    authMock.isLogged.mockReturnValueOnce(false);

    await harness.navigateByUrl('/private');

    expect(location.path().startsWith('/login')).toBe(true);

    const url = new URL('http://dummy' + location.path());
    expect(url.searchParams.get('returnUrl')).toBe('/private');
  });

  it('correctly calculates returnUrl for routes with nested segments', async () => {
    authMock.isLogged.mockReturnValueOnce(false);

    await harness.navigateByUrl('/projects/123/edit');

    const url = new URL('http://dummy' + location.path());
    expect(url.pathname).toBe('/login');
    expect(url.searchParams.get('returnUrl')).toBe('/projects/123/edit');
  });

  it('loginBlockGuard: blocks /login if isLogged()=true → redirects to /', async () => {
    authMock.isLogged.mockReturnValueOnce(true);

    await harness.navigateByUrl('/login');

    expect(location.path()).toBe('/');
    expect(harness.routeNativeElement?.textContent).toContain('Home');
  });

  it('loginBlockGuard: allows /login if isLogged()=false', async () => {
    authMock.isLogged.mockReturnValueOnce(false);

    await harness.navigateByUrl('/login');

    expect(location.path()).toBe('/login');
    expect(harness.routeNativeElement?.textContent).toContain('Login');
  });
});
