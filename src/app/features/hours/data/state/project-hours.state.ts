import { computed, inject, Injectable, signal } from '@angular/core';
import { ProjectHoursRepo } from '../repos/project-hours.repo';
import { CreateProjectHoursRequest, ProjectHoursDTO } from '@app/domain/models';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable()
export class ProjectHoursState {
  private readonly repo = inject(ProjectHoursRepo);

  readonly items = signal<ProjectHoursDTO[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly byIdMap = computed(() => {
    const map = new Map<number, ProjectHoursDTO>();
    for (const it of this.items()) map.set(it.id, it);
    return map;
  });

  readonly totalHours = computed(() => this.items().reduce((acc, it) => acc + it.workedHours, 0));

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);
    this.repo
      .getAll()
      .pipe(
        tap((list) => this.items.set(list)),
        catchError((err) => {
          this.error.set(err?.message ?? 'Error al cargar horas');
          this.items.set([]);
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  loadByProject(projectId: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.repo
      .getByProjectId(projectId)
      .pipe(
        tap((list) => this.items.set(list)),
        catchError((err) => {
          this.error.set(err.message ?? 'Error al cargar horas por proyecto');
          this.items.set([]);
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  loadByUser(userId: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.repo
      .getByUserId(userId)
      .pipe(
        tap((list) => this.items.set(list)),
        catchError((err) => {
          this.error.set(err?.message ?? 'Error al cargar horas por usuario');
          this.items.set([]);
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  create(dto: CreateProjectHoursRequest): void {
    this.error.set(null);
    // Optimistic entity (negative Id for tracking)
    const tempId = -Math.floor(Math.random() * 1_000_000);
    const optimistic: ProjectHoursDTO = {
      id: tempId,
      project: { id: dto.projectId, name: '(cargando...)' },
      user: { id: dto.userId, name: '(cargando...)', type: 'user' },
      workedHours: dto.workedHours,
      workDate: dto.workDate,
      description: dto.description,
    };
    this.items.update((list) => [optimistic, ...list]);

    this.repo
      .create(dto)
      .pipe(
        tap((created) => {
          this.items.update((list) => list.map((it) => (it.id === tempId ? created : it)));
        }),
        catchError((err) => {
          this.items.update((list) => list.filter((it) => it.id !== tempId));
          this.error.set(err?.message ?? 'Error al crear carga de horas');
          return of(null);
        }),
      )
      .subscribe();
  }

  delete(id: number): void {
    this.error.set(null);
    const snapshot = this.items();
    this.items.update((list) => list.filter((it) => it.id !== id));

    this.repo
      .delete(id)
      .pipe(
        catchError((err) => {
          this.items.set(snapshot);
          this.error.set(err?.message ?? 'Error al eliminar horas');
          return of(void 0);
        }),
      )
      .subscribe();
  }
}
