import { computed, inject, Injectable, signal } from '@angular/core';
import { CreateProjectRequest, ProjectDTO, ProjectMiniDTO } from '@app/domain/models';
import { ProjectsApi } from '@app/infrastructure/api/projects/project/projects.api';
import { firstValueFrom } from 'rxjs';

export type ProjectFilters = Readonly<{
  q: string;
  state: string | '';
  responsibleId: number | null;
}>;

/** Estado interno por tipo de operación (para feedback granular en la UI) */
type Op = 'list' | 'minis' | 'detail' | 'create' | 'edit' | 'delete';

@Injectable()
export class ProjectState {
  private readonly api = inject(ProjectsApi);

  // UI State
  readonly filters = signal<ProjectFilters>({ q: '', state: '', responsibleId: null });

  // Operation flags
  private readonly loadingFlags = signal<Record<Op, boolean>>({
    list: false,
    minis: false,
    detail: false,
    create: false,
    edit: false,
    delete: false,
  });

  private readonly errors = signal<Partial<Record<Op, string>>>({});

  // --- Data ---
  /** Lista actual (post-filtro) */
  readonly projects = signal<ProjectDTO[]>([]);
  /** Minis cacheados */
  readonly minis = signal<ProjectMiniDTO[]>([]);
  /** Cache por id (detalle) */
  private readonly byId = signal<Map<number, ProjectDTO>>(new Map());
  /** ID seleccionado (detalle) */
  readonly selectedId = signal<number | null>(null);

  // --- Derived / Computed ---
  readonly loadingList = computed(() => this.loadingFlags().list);
  readonly loadingDetail = computed(() => this.loadingFlags().detail);
  readonly saving = computed(() => this.loadingFlags().create || this.loadingFlags().edit);
  readonly deleting = computed(() => this.loadingFlags().delete);

  readonly listError = computed(() => this.errors().list ?? null);
  readonly detailError = computed(() => this.errors().detail ?? null);
  readonly isEmpty = computed(() => !this.loadingList() && this.projects().length === 0);

  /** Proyecto seleccionado desde el cache si existe */
  readonly selected = computed<ProjectDTO | null>(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.byId().get(id) ?? null;
  });

  /** Cantidad total (para paginación futura) */
  readonly total = computed(() => this.projects().length);

  // ======= Acciones públicas =======

  /** Sólo selecciona el id, sin recargar */
  select(id: number): void {
    this.selectedId.set(id);
  }

  /** Devuelve entidad por id si está en cache */
  entityById(id: number): ProjectDTO | null {
    return this.byId().get(id) ?? null;
  }

  /** Indica si el detalle está en loading */
  entityLoading(id: number): boolean {
    // Podrías tener loadingFlags.detail por id, pero si sólo hay un loading detail global:
    return this.loadingFlags().detail && this.selectedId() === id;
  }

  /** Indica error del detalle */
  entityError(id: number): string | null {
    return this.errors().detail ?? null;
  }

  /** Carga la lista según filtros actuales (server-first cuando aplica) */
  async loadList(): Promise<void> {
    this.setLoading('list', true);
    this.setError('list', null);

    const { q, state, responsibleId } = this.filters();

    try {
      let list: ProjectDTO[];

      const onlyState = !!state && !responsibleId && !q;
      const onlyResp = !!responsibleId && !state && !q;
      const qLooksLikeCode = this.looksLikeCode(q);

      if (onlyState) {
        list = await firstValueFrom(this.api.getByState(state));
      } else if (onlyResp) {
        list = await firstValueFrom(this.api.getByResponsible(responsibleId));
      } else if (!!q && qLooksLikeCode && !state && !responsibleId) {
        const item = await firstValueFrom(this.api.getByCode(q));
        list = item ? [item] : [];
      } else {
        list = await firstValueFrom(this.api.getAll());
        // filtro client-side por q (name/keyword/owner code/description)
        if (q?.trim()) {
          const needle = q.trim().toLowerCase();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(needle) ||
              p.keyword?.toLowerCase().includes(needle) ||
              p.code.toLowerCase().includes(needle) ||
              p.description?.toLowerCase().includes(needle),
          );
        }
        // filtro adicional por state/responsible si vinieron combinados
        if (state) list = list.filter((p) => (p.state ?? '') === state);
        if (responsibleId) list = list.filter((p) => (p.responsible?.id ?? 0) === responsibleId);
      }

      this.projects.set(list);
      // refrescamos cache por id (merge inmutable, sin sobreescribir detalle si ya estaba ampliado)
      if (list.length) {
        const current = this.byId();
        const next = new Map(current);
        list.forEach((p) => {
          // si ya hay uno con este id, preferimos el que parece "más completo"
          const prev = current.get(p.id);
          next.set(p.id, prev ? { ...prev, ...p } : p);
        });
        this.byId.set(next);
      }
    } catch (e) {
      console.error('[ProjectsStore] loadList error', e);
      this.setError('list', 'No pudimos cargar los proyectos.');
      this.projects.set([]);
    } finally {
      this.setLoading('list', false);
    }
  }

  /** Carga la lista mini (para selects/autocomplete) */
  async loadMinis(): Promise<void> {
    this.setLoading('minis', true);
    this.setError('minis', null);
    try {
      const minis = await firstValueFrom(this.api.getAllMini());
      this.minis.set(minis);
    } catch (e) {
      console.error('[ProjectsStore] loadMinis error', e);
      this.setError('minis', 'No pudimos cargar el listado resumido.');
      this.minis.set([]);
    } finally {
      this.setLoading('minis', false);
    }
  }

  /** Cambia filtros y recarga lista */
  setFilters(patch: Partial<ProjectFilters>): void {
    this.filters.update((f) => ({ ...f, ...patch }));
    void this.loadList();
  }

  /** Carga el detalle y marca como seleccionado */
  async loadById(id: number): Promise<void> {
    if (!id) return;
    this.selectedId.set(id);

    this.setLoading('detail', true);
    this.setError('detail', null);
    try {
      const project = await firstValueFrom(this.api.getById(id));
      const next = new Map(this.byId());
      next.set(id, project);
      this.byId.set(next);
    } catch (e) {
      console.error('[ProjectsStore] loadById error', e);
      this.setError('detail', 'No pudimos cargar el proyecto.');
    } finally {
      this.setLoading('detail', false);
    }
  }

  async create(userId: number, payload: CreateProjectRequest): Promise<number | null> {
    this.setLoading('create', true);
    this.setError('create', null);
    try {
      const created = await firstValueFrom(this.api.create(userId, payload));
      this.projects.update((list) => [created, ...list]);
      const next = new Map(this.byId());
      next.set(created.id, created);
      this.byId.set(next);
      return created.id;
    } catch (e) {
      console.error('[ProjectsStore] create error', e);
      this.setError('create', 'No pudimos crear el proyecto.');
      return null;
    } finally {
      this.setLoading('create', false);
    }
  }

  async edit(projectId: number, patch: Partial<ProjectDTO>): Promise<number | null> {
    this.setLoading('edit', true);
    this.setError('edit', null);
    try {
      const updated = await firstValueFrom(this.api.edit(projectId, patch));
      const next = new Map(this.byId());
      next.set(projectId, updated);
      this.byId.set(next);
      this.projects.update((list) => list.map((p) => (p.id === projectId ? updated : p)));
      return projectId;
    } catch (e) {
      console.error('[ProjectsStore] edit error', e);
      this.setError('edit', 'No pudimos guardar los cambios.');
      return null;
    } finally {
      this.setLoading('edit', false);
    }
  }

  /** Eliminar, sacando de lista y cache */
  async remove(userId: number, projectId: number): Promise<boolean> {
    this.setLoading('delete', true);
    this.setError('delete', null);
    // snapshot para rollback si falla
    const snapList = this.projects();
    const snapById = this.byId();

    // optimismo: retiramos de UI al toque
    this.projects.update((list) => list.filter((p) => p.id !== projectId));
    const nextMap = new Map(snapById);
    nextMap.delete(projectId);
    this.byId.set(nextMap);

    try {
      await firstValueFrom(this.api.delete(userId, projectId));
      if (this.selectedId() === projectId) this.selectedId.set(null);
      return true;
    } catch (e) {
      console.error('[ProjectsStore] delete error', e);
      this.setError('delete', 'No pudimos eliminar el proyecto.');
      // rollback
      this.projects.set(snapList);
      this.byId.set(snapById);
      return false;
    } finally {
      this.setLoading('delete', false);
    }
  }

  /** Forzar refresco del seleccionado desde server (útil tras cambios externos) */
  async refreshSelected(): Promise<void> {
    const id = this.selectedId();
    if (!id) return;
    this.setLoading('detail', true);
    this.setError('detail', null);
    try {
      const project = await firstValueFrom(this.api.getById(id));
      const next = new Map(this.byId());
      next.set(id, project);
      this.byId.set(next);
      // también sincronizamos en lista si existe
      this.projects.update((list) => list.map((p) => (p.id === id ? project : p)));
    } catch (e) {
      console.error('[ProjectsStore] refreshSelected error', e);
      this.setError('detail', 'No pudimos actualizar el proyecto.');
    } finally {
      this.setLoading('detail', false);
    }
  }

  // ======= Helpers =======
  private setLoading(op: Op, on: boolean): void {
    this.loadingFlags.update((s) => ({ ...s, [op]: on }));
  }

  private setError(op: Op, msg: string | null): void {
    this.errors.update((s) => {
      const n = { ...s };
      if (!msg) delete n[op];
      else n[op] = msg;
      return n;
    });
  }

  /** Heurística simple: un código típico (ej. "PRJ-001") */
  private looksLikeCode(q: string | undefined): boolean {
    if (!q) return false;
    const s = q.trim();
    // Ajustá el patrón a tu realidad; este es un ejemplo
    return /^[A-Za-z]{2,5}-?\d{1,6}$/i.test(s);
  }
}
