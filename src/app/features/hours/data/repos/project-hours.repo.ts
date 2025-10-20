import { inject, Injectable } from '@angular/core';
import { CreateProjectHoursRequest, ProjectHoursDTO } from '@app/domain/models';
import { ProjectHoursApi } from '@app/infrastructure/api/hours/project-hours/project-hours.api';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectHoursRepo {
  private readonly api = inject<ProjectHoursApi>(ProjectHoursApi);

  getAll(): Observable<ProjectHoursDTO[]> {
    return this.api.getAll();
  }

  getById(id: number): Observable<ProjectHoursDTO> {
    return this.api.getById(id);
  }

  getByUserId(userId: number): Observable<ProjectHoursDTO[]> {
    return this.api.getByUserId(userId);
  }

  getByProjectId(projectId: number): Observable<ProjectHoursDTO[]> {
    return this.api.getByProjectId(projectId);
  }

  create(dto: CreateProjectHoursRequest): Observable<ProjectHoursDTO> {
    return this.api.create(dto);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(id);
  }
}
