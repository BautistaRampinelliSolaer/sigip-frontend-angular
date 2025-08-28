import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_URL } from "@app/core/http/api.tokens";
import { ApiResponse, ProjectDTO, ProjectMiniDTO } from "@app/domain/models";
import { CreateProjectRequest } from "@app/domain/models/projects/create-project-request";
import { ProjectsApi } from "./abstract/projects.api";

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiHttp extends ProjectsApi {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL) + '/api/projects';

  getAll() {
    return this.http.get<ApiResponse<ProjectDTO[]>>(`${this.api}/getAll`);
  }

  getAllMini() {
    return this.http.get<ApiResponse<ProjectMiniDTO[]>>(`${this.api}/getAllMini`);
  }

  create(userId: number, payload: CreateProjectRequest) {
    return this.http.post<ApiResponse<ProjectDTO>>(`${this.api}/create/${userId}`, payload);
  }
}
