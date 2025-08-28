import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { CompanyHttpApi } from "../company.http.api";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { API_URL } from "@app/core/http/api.tokens";
import { ApiResponse, Company, CreateCompanyRequest } from "@app/domain/models";
import { firstValueFrom } from "rxjs";
import { sharedCompanyApiHttpSpec } from "./company.http.api.shared-spec";

describe('CompanyHttpApi', () => {
  let api: CompanyHttpApi;
  let httpMock: HttpTestingController;

  const BASE = 'http://test/api/companies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),          
        provideHttpClientTesting(),  
        { provide: API_URL, useValue: 'http://test' },
        CompanyHttpApi,
      ],
    });

    api = TestBed.inject(CompanyHttpApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  sharedCompanyApiHttpSpec(
    () => TestBed.inject(CompanyHttpApi),
    () => TestBed.inject(HttpTestingController),
    BASE,
  );

  it('listAll() debe hacer GET a /all y devolver Company[] desempaquetado', async () => {
    const mockCompanies: Company[] = [
      { id: 1, name: 'ACME' },
      { id: 2, name: 'Wayne Enterprises' },
    ];

    const promise = firstValueFrom(api.listAll());

    const req = httpMock.expectOne(`${BASE}/all`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<Company[]> = { status: 'OK', message: 'ok', data: mockCompanies };
    req.flush(body);

    await expect(promise).resolves.toEqual(mockCompanies);
  });

  it('getById() debe hacer GET a /:id y devolver Company', async () => {
    const company: Company = { id: 42, name: 'Stark Industries' };

    const promise = firstValueFrom(api.getById(42));

    const req = httpMock.expectOne(`${BASE}/42`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<Company> = { status: 'OK', message: 'ok', data: company };
    req.flush(body);

    await expect(promise).resolves.toEqual(company);
  });

  it('create() debe hacer POST a /create con el dto y devolver Company', async () => {
    const dto: CreateCompanyRequest = { name: 'Umbrella' };
    const created: Company = { id: 10, name: 'Umbrella' };

    const promise = firstValueFrom(api.create(dto));

    const req = httpMock.expectOne(`${BASE}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);

    const body: ApiResponse<Company> = { status: 'OK', message: 'created', data: created };
    req.flush(body);

    await expect(promise).resolves.toEqual(created);
  });

  it('update() debe hacer PUT a /update con {id, ...dto} y devolver Company', async () => {
    const dto: Partial<CreateCompanyRequest> = { commercialName: 'Umbrella Corp.' };
    const updated: Company = { id: 10, name: 'Umbrella', commercialName: 'Umbrella Corp.' };

    const promise = firstValueFrom(api.update(10, dto));

    const req = httpMock.expectOne(`${BASE}/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ id: 10, ...dto });

    const body: ApiResponse<Company> = { status: 'OK', message: 'updated', data: updated };
    req.flush(body);

    await expect(promise).resolves.toEqual(updated);
  });

  it('delete() debe hacer DELETE a /delete/:id y completar (void)', async () => {
    const promise = firstValueFrom(api.delete(7));

    const req = httpMock.expectOne(`${BASE}/delete/7`);
    expect(req.request.method).toBe('DELETE');

    const body: ApiResponse<void> = { status: 'OK', message: 'deleted', data: undefined as void };
    req.flush(body);

    await expect(promise).resolves.toBeUndefined();
  });

  it('propaga errores HTTP (ej: 404) tal cual', async () => {
    const promise = firstValueFrom(api.getById(999));

    const req = httpMock.expectOne(`${BASE}/999`);
    expect(req.request.method).toBe('GET');

    req.flush({ status: 'ERR', message: 'not found', data: null }, { status: 404, statusText: 'Not Found' });

    await expect(promise).rejects.toMatchObject({ status: 404 });
  });
});