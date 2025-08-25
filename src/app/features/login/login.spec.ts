import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Router } from '@angular/router';
import { LoginPage } from './login.page';
import { AuthService } from '@app/core/auth/auth.service';
import { LOGIN_NAV_DELAY_MS } from './login-delay.token';

// Simple test doubles for external services
const createAuthMock = () => ({ login: vi.fn() });
const createRouterMock = () => ({ navigateByUrl: vi.fn() });

describe('LoginPage', () => {
  let authMock: ReturnType<typeof createAuthMock>;
  let routerMock: ReturnType<typeof createRouterMock>;

  beforeEach(() => {
    authMock = createAuthMock();
    routerMock = createRouterMock();
  });

  const renderLogin = async () =>
    render(LoginPage, {
      providers: [
        { provide: LOGIN_NAV_DELAY_MS, useValue: 0 },
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    });

  it('should render Spanish UI texts and initial state', async () => {
    await renderLogin();

    // UI texts
    expect(
      screen.getByRole('heading', { level: 2, name: 'Inicio de sesión' }),
    ).toBeInTheDocument();

    // Inputs exist with proper placeholders
    const username = screen.getByPlaceholderText('username');
    const password = screen.getByPlaceholderText('password');
    expect(username).toBeInTheDocument();
    expect(password).toHaveAttribute('type', 'password');

    // Toggle password button starts with "Mostrar contraseña"
    expect(
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
    ).toBeInTheDocument();

    // Submit starts disabled because the form is invalid
    const submit = screen.getByRole('button', { name: 'Ingresar' });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute('aria-busy', 'false');
  });

  it('should show required errors after submit with empty form', async () => {
    const { container } = await renderLogin();

    // Do not click disabled submit; submit the <form> programmatically
    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    // Errors after markAllAsTouched()
    expect(
      await screen.findByText('Ingresá tu usuario.'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('La contraseña es obligatoria.'),
    ).toBeInTheDocument();
  });

  it('should show minlength error for short password', async () => {
    const { container } = await renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('username'), 'pepe');
    await user.type(screen.getByPlaceholderText('password'), '123');

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(await screen.findByText('Mínimo 6 caracteres.')).toBeInTheDocument();
  });

  it('should toggle password visibility and aria-label/icon', async () => {
    await renderLogin();
    const user = userEvent.setup();

    // Initial state: hidden
    const pwd = screen.getByPlaceholderText('password');
    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' });
    expect(pwd).toHaveAttribute('type', 'password');

    await user.click(toggle);

    // After click: visible + aria-label/icon updated
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument();
    expect(pwd).toHaveAttribute('type', 'text');
    expect(screen.getByText('visibility_off')).toBeInTheDocument();
  });

  it('should submit when pressing Enter on password input if form is valid', async () => {
    await renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('username'), 'john');
    await user.type(screen.getByPlaceholderText('password'), 'secret1');

    // Press Enter inside password input
    await user.keyboard('{Enter}');

    expect(authMock.login).toHaveBeenCalledTimes(1);
    expect(authMock.login).toHaveBeenCalledWith({
      username: 'john',
      password: 'secret1',
    });
  });

it('should call AuthService then navigate after 500ms; loading UI and disabled submit while loading', async () => {

  await renderLogin();

  const user = userEvent.setup();

  await user.type(screen.getByPlaceholderText('username'), 'ana');
  await user.type(screen.getByPlaceholderText('password'), 'secreta');

  // Previous state 
  const submit = screen.getByRole('button', { name: 'Ingresar' });
  await user.click(submit);

  // After submit, the name changes
  const loadingBtn = screen.getByRole('button', { name: 'Ingresando…' });
  expect(loadingBtn).toBeDisabled();
  expect(loadingBtn).toHaveAttribute('aria-busy', 'true');
  expect(authMock.login).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  // After request, the button changes again
  const submitAfter = await screen.findByRole('button', { name: 'Ingresar' });
  expect(submitAfter).toBeEnabled();
});

  it('should not submit invalid form and should mark controls as touched (errors visible)', async () => {
    const { container } = await renderLogin();

    // Submit form with empty controls (do not click disabled button)
    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(authMock.login).not.toHaveBeenCalled();
    expect(await screen.findByText('Ingresá tu usuario.')).toBeInTheDocument();
    expect(await screen.findByText('La contraseña es obligatoria.')).toBeInTheDocument();
  });
});
