import { describe, it } from 'vitest';
import { ProjectsApiHttp } from '../projects.http.api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { API_URL } from '@app/core/http/api.tokens';
import {
  ApiResponse,
  CreateProjectRequest,
  DocumentMiniDTO,
  ObjectMiniDTO,
  ProjectDTO,
  ProjectMiniDTO,
} from '@app/domain/models';
import { firstValueFrom } from 'rxjs';

describe('ProjectsHttpApi, specific', () => {
  let api: ProjectsApiHttp;
  let httpMock: HttpTestingController;
  const BASE = 'http://test/api/projects';
  const objMini: ObjectMiniDTO = { name: 'object', id: 10, type: '' };
  const docMini: DocumentMiniDTO = {};
  const set: Set<DocumentMiniDTO> = new Set();
  const projectA: ProjectDTO = {
    id: 1,
    code: 'A1',
    name: 'Project A',
    responsible: objMini,
    company: objMini,
    plantCompany: objMini,
    clientContact: objMini,
    documents: set.add(docMini),
    creationDate: '01/01/2020',
    folderPath: 'C:/path',
    image: 'image_path',
    keyword: 'keyword',
    description: 'description',
    observations: new Set(),
    profiles: 'C',
    modelingTechniques: 'some',
    standards: 'Iram',
    budget: objMini,
    state: 'In Process',
    corrector: objMini,
    reviewer: objMini,
    type: 'Design',
  };
  const projectB: ProjectDTO = {
    id: 2,
    code: 'B2',
    name: 'Project B',
    responsible: objMini,
    company: objMini,
    plantCompany: objMini,
    clientContact: objMini,
    documents: set.add(docMini),
    creationDate: '02/02/2020',
    folderPath: 'C:/path/2',
    image: 'image_path/2',
    keyword: 'keyword2',
    description: 'description2',
    observations: new Set(),
    profiles: 'H',
    modelingTechniques: 'some2',
    standards: 'Iram 9001',
    budget: objMini,
    state: 'To Do',
    corrector: objMini,
    reviewer: objMini,
    type: 'Engineering detail',
  };
  const items: ProjectDTO[] = [projectA, projectB];
  const projectMiniA: ProjectMiniDTO = {
    id: 1,
    name: 'Project A',
  };
  const projectMiniB: ProjectMiniDTO = {
    id: 2,
    name: 'Project B',
  };
  const miniItems: ProjectMiniDTO[] = [projectMiniA, projectMiniB];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'http://test' },
        ProjectsApiHttp,
      ],
    });
    api = TestBed.inject(ProjectsApiHttp);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('get all -> return array of projects', async () => {
    const all = firstValueFrom(api.getAll());

    const req = httpMock.expectOne(`${BASE}/all`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ProjectDTO[]> = {
      status: 'OK',
      message: 'success',
      data: items,
    };
    req.flush(body);

    await expect(all).resolves.toEqual(items);
  });

  it('getById -> GET /:id and return dto', async () => {
    const dto: ProjectDTO = projectA;

    const p = firstValueFrom(api.getById(1));

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ProjectDTO> = { status: 'OK', message: 'success', data: dto };
    req.flush(body);

    await expect(req).resolves.toEqual(p);
  });

  it('get all mini', async () => {
    const allMini = firstValueFrom(api.getAllMini());
    
    const req = httpMock.expectOne(`${BASE}/getAllMini`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ProjectMiniDTO[]> = { status: 'OK', message: 'success', data: miniItems };
    req.flush(body);

    await expect(allMini).resolves.toEqual(miniItems);
  });

  it('getByState', async () => {
    const res = firstValueFrom(api.getByState('In Process'));

    const req = httpMock.expectOne(`${BASE}/ByState/In Process`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ProjectDTO[]> = { status: 'OK', message: 'success', data: [projectA]};
    req.flush(body)

    await expect(res).resolves.toEqual(projectA);
  });

  it('getByResponsible', async () => {
    const res = firstValueFrom(api.getByResponsible(10));

    const req = httpMock.expectOne(`${BASE}/ByResponsible/10`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ProjectDTO[]> = { status: 'OK', message: 'success', data: items };
    req.flush(body)

    await expect(res).resolves.toEqual(items);
  });

  it('get by code', async () => {
    const res = firstValueFrom(api.getByCode('A1'));

    const req = httpMock.expectOne(`${BASE}/ByCode/A1`);
    expect(req.request.method).toBe('GET');

    const body: ApiResponse<ProjectDTO> = { status: 'OK', message: 'success', data: projectA };
    req.flush(body);

    await expect(res).resolves.toEqual(projectA);
  });

  it('create and return dto', async () => {
    const reqBody: CreateProjectRequest = {
        code: 'C3',
        name: 'Project C',
        description: 'description3',
        standards: 'Iram',
        responsibleId: 10,
        state: 'To Do',
        reviewerId: 10,
        type: 'Design'
    };

    const created: ProjectDTO = {
        code: 'C3',
        name: 'Project C',
        description: 'description3',
        standards: 'Iram',
        responsible: objMini,
        state: 'To Do',
        reviewer: objMini,
        type: 'Design',
        id: 0,
        company: objMini,
        plantCompany: objMini,
        clientContact: objMini,
        documents: new Set([docMini]),
        creationDate: '',
        folderPath: '',
        image: '',
        keyword: '',
        observations: new Set(['']),
        profiles: '',
        modelingTechniques: '',
        budget: objMini,
        corrector: objMini
    };

    const res = firstValueFrom(api.create(10, reqBody));

    const req = httpMock.expectOne(`${BASE}/create`);
    expect(req.request.method).toBe('POST');

    expect('id' in (req.request.body as object)).toBe(false);
    expect(req.request.body).toEqual(reqBody);

    const body: ApiResponse<ProjectDTO> = {status: 'OK', message: 'success', data: created };
    req.flush(body);

    await expect(res).resolves.toEqual(created);
  });

  it('update -> with a partial dto and return the dto updated', async () => {
    const patch: Partial<ProjectDTO> = { state: 'Completed' };
    const updated: ProjectDTO = { state: 'Completed', ...projectA };

    const res = firstValueFrom(api.edit(10, patch));

    const req = httpMock.expectOne(`${BASE}/edit`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body);
    
    const body: ApiResponse<ProjectDTO> = { status: 'OK', message: 'success', data: updated };
    req.flush(body);

    await expect(res).resolves.toEqual(updated);
  });

  it('Delete, return void', async () => {
    const res = firstValueFrom(api.delete(1, 1));

    const req = httpMock.expectOne(`${BASE}/delete/1/1`);
    expect(req.request.method).toBe('DELETE');

    const body: ApiResponse<void> = { status: 'OK', message: 'success', data: undefined as void };
    req.flush(body);

    await expect(res).resolves.toBeUndefined();
  });
});
