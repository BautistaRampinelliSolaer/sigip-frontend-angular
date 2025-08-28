import { ApiResponse, CreateProjectRequest, ProjectDTO, ProjectMiniDTO } from "@app/domain/models";
import { Observable } from "rxjs/internal/Observable";

export abstract class ProjectsApi {
  abstract getAll(): Observable<ApiResponse<ProjectDTO[]>>;
  abstract getAllMini(): Observable<ApiResponse<ProjectMiniDTO[]>>;
  abstract create(userId: number, payload: CreateProjectRequest): Observable<ApiResponse<ProjectDTO>>;
}
