import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  CreateProjectHoursRequest,
  ProjectHoursDTO,
  ProjectMiniDTO,
  ObjectMiniDTO,
} from '@app/domain/models';
import { ProjectHoursApi } from './project-hours.api';

const LATENCY_MS = 250;

@Injectable({ providedIn: 'root' })
export class ProjectHoursMockApi implements ProjectHoursApi {
  // --- seed de datos de ejemplo ---
  private readonly projects: ProjectMiniDTO[] = [
    { id: 1, name: 'SIGIP – Core' },
    { id: 2, name: 'SIGIP – UI/UX' },
  ];

  private readonly users: ObjectMiniDTO[] = [
    { id: 1, name: 'Ana', type: 'user' },
    { id: 2, name: 'Carlos', type: 'user' },
  ];

  private seq = 1000;

  private data: ProjectHoursDTO[] = [
    {
      id: 1,
      project: this.projects[0],
      user: this.users[0],
      workedHours: 3.5,
      workDate: '2025-09-18',
      description: 'Refactor store de clientes y signals',
    },
    {
      id: 2,
      project: this.projects[0],
      user: this.users[1],
      workedHours: 2,
      workDate: '2025-09-19',
      description: 'Tests de guards con Vitest',
    },
    {
      id: 3,
      project: this.projects[1],
      user: this.users[0],
      workedHours: 4,
      workDate: '2025-09-20',
      description: 'Tabla reutilizable (Data Grid) + drag&drop',
    },
  ];

  // --- helpers ---
  private findProject(id: number): ProjectMiniDTO | undefined {
    return this.projects.find((p) => p.id === id);
  }
  private findUser(id: number): ObjectMiniDTO | undefined {
    return this.users.find((u) => u.id === id);
  }
  private notFound<T>(msg: string): Observable<T> {
    return throwError(() => new Error(msg));
  }

  // --- API ---
  getAll(): Observable<ProjectHoursDTO[]> {
    return of(structuredClone(this.data)).pipe(delay(LATENCY_MS));
  }

  getById(projectHoursId: number): Observable<ProjectHoursDTO> {
    const item = this.data.find((x) => x.id === projectHoursId);
    if (!item)
      return this.notFound<ProjectHoursDTO>(`ProjectHours id=${projectHoursId} no encontrado`);
    return of(structuredClone(item)).pipe(delay(LATENCY_MS));
  }

  getByUserId(userId: number): Observable<ProjectHoursDTO[]> {
    return of(this.data.filter((x) => x.user.id === userId).map((x) => structuredClone(x))).pipe(
      delay(LATENCY_MS),
    );
  }

  getByProjectId(projectId: number): Observable<ProjectHoursDTO[]> {
    return of(
      this.data.filter((x) => x.project.id === projectId).map((x) => structuredClone(x)),
    ).pipe(delay(LATENCY_MS));
  }

  create(dto: CreateProjectHoursRequest): Observable<ProjectHoursDTO> {
    // Validaciones básicas
    if (dto.workedHours <= 0) {
      return this.notFound<ProjectHoursDTO>('workedHours debe ser > 0');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dto.workDate)) {
      return this.notFound<ProjectHoursDTO>('workDate debe tener formato YYYY-MM-DD');
    }

    const project = this.findProject(dto.projectId);
    if (!project) return this.notFound<ProjectHoursDTO>(`Proyecto id=${dto.projectId} inexistente`);

    const user = this.findUser(dto.userId);
    if (!user) return this.notFound<ProjectHoursDTO>(`Usuario id=${dto.userId} inexistente`);

    const entity: ProjectHoursDTO = {
      id: ++this.seq,
      project,
      user,
      workedHours: dto.workedHours,
      workDate: dto.workDate,
      description: dto.description,
    };

    // prepend para que lo más nuevo aparezca primero
    this.data = [entity, ...this.data];
    return of(structuredClone(entity)).pipe(delay(LATENCY_MS));
  }

  delete(projectHoursId: number): Observable<void> {
    const idx = this.data.findIndex((x) => x.id === projectHoursId);
    if (idx === -1) return this.notFound<void>(`ProjectHours id=${projectHoursId} no encontrado`);
    this.data.splice(idx, 1);
    return of(void 0).pipe(delay(LATENCY_MS));
  }
}
