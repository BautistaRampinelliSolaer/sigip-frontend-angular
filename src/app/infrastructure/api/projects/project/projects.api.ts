import { CreateProjectRequest, ProjectDTO, ProjectMiniDTO } from "@app/domain/models";
import { Observable } from "rxjs/internal/Observable";

export abstract class ProjectsApi {
  abstract getAll(): Observable<ProjectDTO[]>;
  abstract getById(projectId: number): Observable<ProjectDTO>;
  abstract getAllMini(): Observable<ProjectMiniDTO[]>;
  abstract getByState(state: string): Observable<ProjectDTO[]>;
  abstract getByResponsible(responsibleId: number): Observable<ProjectDTO[]>;
  abstract getByCode(code: string): Observable<ProjectDTO>;
  abstract create(userId: number, payload: CreateProjectRequest): Observable<ProjectDTO>;
  abstract edit(projectId: number, payload: Partial<ProjectDTO>): Observable<ProjectDTO>;
  abstract delete(userId: number, projectId: number): Observable<void>;
}
