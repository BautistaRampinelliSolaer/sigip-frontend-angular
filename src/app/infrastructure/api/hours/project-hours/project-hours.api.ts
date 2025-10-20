import { CreateProjectHoursRequest, ProjectHoursDTO } from '@app/domain/models';
import { Observable } from 'rxjs';

export abstract class ProjectHoursApi {
  abstract getAll(): Observable<ProjectHoursDTO[]>;
  abstract getById(projectHoursId: number): Observable<ProjectHoursDTO>;
  abstract getByUserId(userId: number): Observable<ProjectHoursDTO[]>;
  abstract getByProjectId(projectId: number): Observable<ProjectHoursDTO[]>;
  abstract create(
    createProjectHoursRequest: CreateProjectHoursRequest,
  ): Observable<ProjectHoursDTO>;
  abstract delete(projectHoursId: number): Observable<void>;
}
