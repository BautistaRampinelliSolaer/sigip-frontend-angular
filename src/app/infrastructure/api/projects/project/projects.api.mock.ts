import { Injectable } from "@angular/core";
import { ProjectsApi } from "./projects.api";
import { of, Observable } from "rxjs";
import { delay, map } from "rxjs/operators";
import { CreateProjectRequest, ProjectDTO, ProjectMiniDTO, ProjectMiniDTO as Mini, ObjectMiniDTO } from "@app/domain/models";

let SEQ = 4;

const SAMPLE_COMPANY: ObjectMiniDTO = { id: 1, name: "Acme S.A.", type: 'company' };
const SAMPLE_PLANT: ObjectMiniDTO = { id: 1, name: "Planta A", type: 'plantCompany' };
const SAMPLE_CONTACT: ObjectMiniDTO = { id: 1, name: "Jorge", type: 'clientContact' };

const data: ProjectDTO[] = [
  {
    id: 1,
    code: "PM1",
    name: "Proyecto Mock 1",
    company: SAMPLE_COMPANY,
    plantCompany: SAMPLE_PLANT,
    clientContact: SAMPLE_CONTACT,
    documents: new Set(),
    creationDate: new Date().toISOString(),
    folderPath: "/projects/1",
    image: "project-1.png",
    keyword: "mock",
    description: "Mock project 1",
    observations: new Set(["Initial mock"]),
    profiles: "default",
    modelingTechniques: "tech-1",
    standards: "std-1",
    responsible: { id: 10, name: "Responsible A" },
    state: "ACTIVE",
    budget: { id: 100, name: "Budget A" },
    corrector: { id: 11, name: "Corrector A" },
    reviewer: { id: 12, name: "Reviewer A" },
    parentProject: undefined,
    type: "TYPE_A",
  },
  {
    id: 2,
    code: "PM2",
    name: "Proyecto Mock 2",
    company: { id: 2, name: "PetroMax S.R.L." },
    plantCompany: { id: 2, name: "Planta B" },
    clientContact: { id: 2, name: "María" },
    documents: new Set(),
    creationDate: new Date().toISOString(),
    folderPath: "/projects/2",
    image: "project-2.png",
    keyword: "mock2",
    description: "Mock project 2",
    observations: new Set(),
    profiles: "profile-x",
    modelingTechniques: "tech-2",
    standards: "std-2",
    responsible: { id: 20, name: "Responsible B" },
    state: "INACTIVE",
    budget: { id: 200, name: "Budget B" },
    corrector: { id: 21, name: "Corrector B" },
    reviewer: { id: 22, name: "Reviewer B" },
    parentProject: { id: 1, name: "Proyecto Mock 1" },
    type: "TYPE_B",
  },
  {
    id: 3,
    code: "PM3",
    name: "Proyecto Mock 3",
    company: SAMPLE_COMPANY,
    plantCompany: SAMPLE_PLANT,
    clientContact: SAMPLE_CONTACT,
    documents: new Set(),
    creationDate: new Date().toISOString(),
    folderPath: "/projects/1",
    image: "project-1.png",
    keyword: "mock",
    description: "Mock project 1",
    observations: new Set(["Initial mock"]),
    profiles: "default",
    modelingTechniques: "tech-1",
    standards: "std-1",
    responsible: { id: 10, name: "Responsible A" },
    state: "ACTIVE",
    budget: { id: 100, name: "Budget A" },
    corrector: { id: 11, name: "Corrector A" },
    reviewer: { id: 12, name: "Reviewer A" },
    parentProject: undefined,
    type: "TYPE_A",
  },
  {
    id: 4,
    code: "PM4",
    name: "Proyecto Mock 4",
    company: { id: 2, name: "PetroMax S.R.L." },
    plantCompany: { id: 2, name: "Planta B" },
    clientContact: { id: 2, name: "María" },
    documents: new Set(),
    creationDate: new Date().toISOString(),
    folderPath: "/projects/2",
    image: "project-2.png",
    keyword: "mock2",
    description: "Mock project 2",
    observations: new Set(),
    profiles: "profile-x",
    modelingTechniques: "tech-2",
    standards: "std-2",
    responsible: { id: 20, name: "Responsible B" },
    state: "INACTIVE",
    budget: { id: 200, name: "Budget B" },
    corrector: { id: 21, name: "Corrector B" },
    reviewer: { id: 22, name: "Reviewer B" },
    parentProject: { id: 1, name: "Proyecto Mock 1" },
    type: "TYPE_B",
  },
];

@Injectable({
  providedIn: "root",
})
export class ProjectsApiMock extends ProjectsApi {
  getAll(): Observable<ProjectDTO[]> {
    return of([...data]).pipe(delay(250));
  }

  getById(projectId: number): Observable<ProjectDTO> {
    return of(data.find((p) => p.id === projectId)).pipe(
      map((p) => {
        if (!p) throw new Error("Project not found: " + projectId);
        return p;
      }),
      delay(150)
    );
  }

  getAllMini(): Observable<ProjectMiniDTO[]> {
    const minis: ProjectMiniDTO[] = data.map((p) => ({ id: p.id, name: p.name, responsible: p.responsible }));
    return of(minis).pipe(delay(150));
  }

  getByState(state: string): Observable<ProjectDTO[]> {
    return of(data.filter((p) => p.state === state)).pipe(delay(150));
  }

  getByResponsible(responsibleId: number): Observable<ProjectDTO[]> {
    return of(data.filter((p) => p.responsible?.id === responsibleId)).pipe(delay(150));
  }

  getByCode(code: string): Observable<ProjectDTO> {
    return of(data.find((p) => p.code === code)).pipe(
      map((p) => {
        if (!p) throw new Error("Project not found with code: " + code);
        return p;
      }),
      delay(120)
    );
  }

  create(userId: number, payload: CreateProjectRequest): Observable<ProjectDTO> {
    const created: ProjectDTO = {
      id: ++SEQ,
      code: payload.code ?? `P${SEQ}`,
      name: payload.name,
      company: payload.companyId ? { id: payload.companyId, name: `Company #${payload.companyId}` } : SAMPLE_COMPANY,
      plantCompany: payload.plantId ? { id: payload.plantId, name: `Plant #${payload.plantId}` } : SAMPLE_PLANT,
      clientContact: payload.clientContactId ? { id: payload.clientContactId, name: `Contact #${payload.clientContactId}` } : SAMPLE_CONTACT,
      documents: new Set(),
      creationDate: new Date().toISOString(),
      folderPath: payload.folderPath ?? `/projects/${SEQ}`,
      image: payload.image ?? "",
      keyword: payload.keyword ?? "",
      description: payload.description ?? "",
      observations: new Set(payload.observations ? [payload.observations] : []),
      profiles: payload.profiles ?? "",
      modelingTechniques: payload.modelingTechniques ?? "",
      standards: payload.standards ?? "",
      responsible: payload.responsibleId ? { id: payload.responsibleId, name: `User #${payload.responsibleId}` } : undefined,
      state: payload.state ?? "ACTIVE",
      budget: payload.budgetId ? { id: payload.budgetId, name: `Budget #${payload.budgetId}` } : { id: 0, name: "Default" },
      corrector: { id: 0, name: "None" },
      reviewer: { id: payload.reviewerId ?? 0, name: `Reviewer #${payload.reviewerId ?? 0}` },
      parentProject: payload.parentProjectId ? { id: payload.parentProjectId, name: `Parent #${payload.parentProjectId}` } : undefined,
      type: payload.type ?? "DEFAULT",
    };
    data.push(created);
    return of(created).pipe(delay(200));
  }

  edit(userId: number, payload: Partial<ProjectDTO>): Observable<ProjectDTO> {
    if (!payload.id) throw new Error("Payload must include project id for edit");
    const idx = data.findIndex((p) => p.id === payload.id);
    if (idx === -1) throw new Error("Project not found: " + payload.id);
    data[idx] = { ...data[idx], ...payload };
    return of({ ...data[idx] }).pipe(delay(160));
  }

  delete(userId: number, projectId: number): Observable<void> {
    const idx = data.findIndex((p) => p.id === projectId);
    if (idx === -1) throw new Error("Project not found: " + projectId);
    data.splice(idx, 1);
    return of(void 0).pipe(delay(120));
  }
}