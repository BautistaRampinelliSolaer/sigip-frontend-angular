import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { API_URL } from '@app/core/http/api.tokens';

import { ClientContactHttpApi } from '../client-contact.http.api';
import type { ApiResponse, ClientContactDTO, CreateClientContactRequest } from '@app/domain/models';
import { firstValueFrom } from 'rxjs';

describe('ClientContactHttpApi (específicos HTTP)', () => {
  let api: ClientContactHttpApi;
  let httpMock: HttpTestingController;
  const BASE = 'http://test/api/client-contacts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),              
        { provide: API_URL, useValue: 'http://test' },
        ClientContactHttpApi,
      ],
    });
    api = TestBed.inject(ClientContactHttpApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());       

  it('listAll() → GET /all y devuelve ClientContactDTO[]', async () => {
    const items: ClientContactDTO[] = [
      { id: 1, name: 'Jorge', email: 'jorge@acme.test', company: { id: 1, name: 'Acme' }, plantCompany: { id: 1, name: 'Planta A' } },
      { id: 2, name: 'María', email: 'maria@pm.test', company: { id: 2, name: 'PetroMax' }, plantCompany: null },
    ];

    const p = firstValueFrom(api.listAll());

    const req = httpMock.expectOne(`${BASE}/all`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ClientContactDTO[]> = { status: 'OK', message: 'ok', data: items };
    req.flush(body);

    await expect(p).resolves.toEqual(items);
  });

  it('getById() → GET /:id y devuelve ClientContactDTO', async () => {
    const dto: ClientContactDTO = { id: 42, name: 'Ana', email: 'ana@acme.test', company: { id: 1, name: 'Acme' }, plantCompany: null };

    const p = firstValueFrom(api.getById(42));

    const req = httpMock.expectOne(`${BASE}/42`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ClientContactDTO> = { status: 'OK', message: 'ok', data: dto };
    req.flush(body);

    await expect(p).resolves.toEqual(dto);
  });

  it('listByCompany() → GET /listByCompany/:companyId', async () => {
    const items: ClientContactDTO[] = [{ id: 7, name: 'Luis', email: 'luis@acme.test', company: { id: 1, name: 'Acme' }, plantCompany: null }];

    const p = firstValueFrom(api.listByCompany(1));

    const req = httpMock.expectOne(`${BASE}/listByCompany/1`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ClientContactDTO[]> = { status: 'OK', message: 'ok', data: items };
    req.flush(body);

    await expect(p).resolves.toEqual(items);
  });

  it('listByPlantCompany() → GET /listByPlantCompany/:plantCompanyId', async () => {
    const items: ClientContactDTO[] = [
      { id: 9, name: 'Pedro', email: 'pedro@acme.test', company: { id: 1, name: 'Acme' }, plantCompany: { id: 3, name: 'Planta C' } },
    ];

    const p = firstValueFrom(api.listByPlantCompany(3));

    const req = httpMock.expectOne(`${BASE}/listByPlantCompany/3`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ClientContactDTO[]> = { status: 'OK', message: 'ok', data: items };
    req.flush(body);

    await expect(p).resolves.toEqual(items);
  });

  it('create() → POST /create con CreateClientContactRequest (sin id) y retorna DTO con id', async () => {
    const reqBody: CreateClientContactRequest = {
      name: 'Julián',
      email: 'julian@test.dev',
      companyId: 1,
      plantCompanyId: 3,
      city: 'La Plata',
    };

    const returned: ClientContactDTO = {
      id: 10,
      name: 'Julián',
      email: 'julian@test.dev',
      company: { id: 1, name: 'Acme' },
      plantCompany: { id: 3, name: 'Planta C' },
      city: 'La Plata',
    };

    const p = firstValueFrom(api.create(reqBody));

    const req = httpMock.expectOne(`${BASE}/create`);
    expect(req.request.method).toBe('POST');

    expect('id' in (req.request.body as object)).toBe(false);
    expect(req.request.body).toEqual(reqBody);

    req.flush({ status: 'OK', message: 'created', data: returned } as ApiResponse<ClientContactDTO>);

    await expect(p).resolves.toEqual(returned);
  });

  it('update() → PUT /update con {id, ...dto} (parcial) y retorna DTO actualizado', async () => {
    const patch: Partial<CreateClientContactRequest> = { phone: '+54 221 000 0000', city: 'CABA' };
    const updated: ClientContactDTO = {
      id: 10, name: 'Julián', phone: '+54 221 000 0000', city: 'CABA', company: null, plantCompany: null,
    };

    const p = firstValueFrom(api.update(10, patch));

    const req = httpMock.expectOne(`${BASE}/update`);
    expect(req.request.method).toBe('PUT');

    expect(req.request.body).toEqual({ id: 10, ...patch });

    req.flush({ status: 'OK', message: 'updated', data: updated } as ApiResponse<ClientContactDTO>);

    await expect(p).resolves.toEqual(updated);
  });

  it('delete() → DELETE /delete/:id y completa (void)', async () => {
    const p = firstValueFrom(api.delete(15));

    const req = httpMock.expectOne(`${BASE}/delete/15`);
    expect(req.request.method).toBe('DELETE');

    req.flush({ status: 'OK', message: 'deleted', data: undefined as void } as ApiResponse<void>);

    await expect(p).resolves.toBeUndefined();
  });

  it('propaga errores HTTP (ej. 404 en getById)', async () => {
    const p = firstValueFrom(api.getById(999));

    const req = httpMock.expectOne(`${BASE}/999`);
    expect(req.request.method).toBe('GET');

    req.flush({ status: 'ERR', message: 'not found', data: null }, { status: 404, statusText: 'Not Found' });

    await expect(p).rejects.toMatchObject({ status: 404 });
  });

  it('propaga errores HTTP (ej. 400 en create por validación)', async () => {
    const p = firstValueFrom(api.create({ name: '' } as CreateClientContactRequest));

    const req = httpMock.expectOne(`${BASE}/create`);
    expect(req.request.method).toBe('POST');

    req.flush({ status: 'ERR', message: 'validation error', data: null }, { status: 400, statusText: 'Bad Request' });

    await expect(p).rejects.toMatchObject({ status: 400 });
  });
});
