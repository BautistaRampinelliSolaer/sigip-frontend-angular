import { Injectable } from "@angular/core";
import { ProjectsApi } from "../abstract/projects.api";
import { of } from "rxjs/internal/observable/of";
import { ApiResponse, CreateProjectRequest, ProjectDTO, ProjectMiniDTO } from "@app/domain/models";
import { delay } from "rxjs/internal/operators/delay";


@Injectable({
  providedIn: 'root'
})
export class ProjectsApiMock extends ProjectsApi {
  getAll() {
    return of({
      data: [
        { id: 1, name: 'Proyecto Mock 1', code: 'PM1' },
        { id: 2, name: 'Proyecto Mock 2', code: 'PM2' }
      ]
    } as ApiResponse<ProjectDTO[]>).pipe(delay(500));
  }

  getAllMini() {
    return of({ 
      status: "",
      message: "",
      data: [
        { id: 1, 
          name: 'Mini Mock', 
          responsible: {}
        }
      ] 
    } as ApiResponse<ProjectMiniDTO[]>).pipe(delay(300));
  }

  create(userId: number, payload: CreateProjectRequest) {
    return of({
      data: {
        id: Math.random(),
        name: payload.name,
        code: payload.code
      }
    } as ApiResponse<ProjectDTO>).pipe(delay(400));
  }
}
