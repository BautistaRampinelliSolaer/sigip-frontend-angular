import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PlantCompanyHttpApi } from '../plant-company.http.api';
import { API_URL } from '@app/core/http/api.tokens';
import type { ApiResponse, PlantCompanyDTO, CreatePlantCompanyRequest } from '@app/domain/models';
import { firstValueFrom } from 'rxjs';
import { sharedPlantCompanyApiHttpSpec } from './plant-company.api.http-shared-spec';

describe('PlantCompanyHttpApi', () => {
  let api: PlantCompanyHttpApi;
  let httpMock: HttpTestingController;

  const BASE = 'http://test/api/plant-companies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'http://test' },
        PlantCompanyHttpApi,
      ],
    });
    api = TestBed.inject(PlantCompanyHttpApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  sharedPlantCompanyApiHttpSpec(
    () => TestBed.inject(PlantCompanyHttpApi),
    () => TestBed.inject(HttpTestingController),
    BASE,
  );
  it('listAll() → GET /getAll y devuelve PlantCompanyDTO[]', async () => {
    const items: PlantCompanyDTO[] = [
      { id: 1, name: 'Planta A', clientContacts: [], company: null },
      { id: 2, name: 'Planta B', clientContacts: [], company: null },
    ];

    const promise = firstValueFrom(api.listAll());

    const req = httpMock.expectOne(`${BASE}/getAll`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<PlantCompanyDTO[]> = { status: 'OK', message: 'ok', data: items };
    req.flush(body);

    await expect(promise).resolves.toEqual(items);
  });

  it('getById() → GET /getById/:id y devuelve PlantCompanyDTO', async () => {
    const dto: PlantCompanyDTO = { id: 42, name: 'Planta X', clientContacts: [], company: null };

    const promise = firstValueFrom(api.getById(42));

    const req = httpMock.expectOne(`${BASE}/getById/42`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<PlantCompanyDTO> = { status: 'OK', message: 'ok', data: dto };
    req.flush(body);

    await expect(promise).resolves.toEqual(dto);
  });

  it('listByCompany() → GET /listByCompany/:companyId y devuelve PlantCompanyDTO[]', async () => {
    const items: PlantCompanyDTO[] = [{ id: 7, name: 'Planta C', clientContacts: [], company: null }];

    const promise = firstValueFrom(api.listByCompany(5));

    const req = httpMock.expectOne(`${BASE}/listByCompany/5`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<PlantCompanyDTO[]> = { status: 'OK', message: 'ok', data: items };
    req.flush(body);

    await expect(promise).resolves.toEqual(items);
  });

  it('create() → POST /create con dto y devuelve PlantCompanyDTO', async () => {
    const dto: CreatePlantCompanyRequest = { name: 'Nueva Planta', city: 'La Plata' };
    const created: PlantCompanyDTO = { id: 10, name: 'Nueva Planta', city: 'La Plata', clientContacts: [], company: null };

    const promise = firstValueFrom(api.create(dto));

    const req = httpMock.expectOne(`${BASE}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);

    const body: ApiResponse<PlantCompanyDTO> = { status: 'OK', message: 'created', data: created };
    req.flush(body);

    await expect(promise).resolves.toEqual(created);
  });

  it('update() → PUT /update con {id, ...dto} y devuelve PlantCompanyDTO', async () => {
    const dto: Partial<CreatePlantCompanyRequest> = { phone: '+54 221 000 0000' };
    const updated: PlantCompanyDTO = {
      id: 10, name: 'Planta Z', phone: '+54 221 000 0000', clientContacts: [], company: null
    };

    const promise = firstValueFrom(api.update(10, dto));

    const req = httpMock.expectOne(`${BASE}/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ id: 10, ...dto });

    const body: ApiResponse<PlantCompanyDTO> = { status: 'OK', message: 'updated', data: updated };
    req.flush(body);

    await expect(promise).resolves.toEqual(updated);
  });

  it('delete() → DELETE /delete/:id y completa (void)', async () => {
    const promise = firstValueFrom(api.delete(9));

    const req = httpMock.expectOne(`${BASE}/delete/9`);
    expect(req.request.method).toBe('DELETE');

    // Importante: con tu unwrap actualizado, esto devuelve undefined (void)
    const body: ApiResponse<void> = { status: 'OK', message: 'deleted', data: undefined as void };
    req.flush(body);

    await expect(promise).resolves.toBeUndefined();
  });

  it('propaga errores HTTP (ej. 404) tal cual', async () => {
    const promise = firstValueFrom(api.getById(999));

    const req = httpMock.expectOne(`${BASE}/getById/999`);
    expect(req.request.method).toBe('GET');

    req.flush({ status: 'ERR', message: 'not found', data: null }, { status: 404, statusText: 'Not Found' });

    await expect(promise).rejects.toMatchObject({ status: 404 });
  });
});