import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { ProjectDTO } from '@app/domain/models';
import { ProjectsApiHttp } from '@app/infrastructure/api';

@Injectable({
  providedIn: 'root'
})
export class ProjectState {
  private readonly api = inject(ProjectsApiHttp);
  private readonly auth = inject(AuthService);

  private readonly _items = signal<ProjectDTO[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _query = signal<string>('');

  items = this._items.asReadonly();
  loading = this._loading.asReadonly();
  query = this._query.asReadonly();

  filtered = computed(() => {
    const q = this._query().toLowerCase().trim();
    if (!q) return this._items();
    return this._items().filter(p => (p.name + '' + p.code).toLowerCase().includes(q)); 
  });

  loadAll(): void {
    this._loading.set(true);
    this.api.getAll().subscribe({
      next: (res) => this._items.set(res.data),
      error: () => {}, // Handle error with logging or user notification
      complete: () => this._loading.set(false)
    });
  }

  createProject(payload: Omit<Parameters<ProjectsApiHttp['create']>[1], never>): void {
    const userId = this.auth.user()?.id ?? 0;
    this.api.create(userId, payload).subscribe({
      next: (res) => this._items.update(list => [res.data, ...list]),
      error: () => {}, // Handle error with logging or user notification
    });
  }

  setQuery(q: string): void { this._query.set(q) }
}
