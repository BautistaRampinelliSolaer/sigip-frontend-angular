import { signal, computed } from "@angular/core";

export class EntityStore<T extends { id: number}> {
    // Normalize Cache
    protected readonly entities = signal<Record<number, T>>({});
    protected readonly ids = signal<number[]>([]);

    // Selectors
    readonly all = computed<T[]>(() => this.ids().map(id => this.entities()[id]).filter(Boolean));
    readonly byId = (id: number) => computed<T | null>(() => this.entities()[id] ?? null);
    readonly count = computed(() => this.ids().length);

    // Mutations
    protected upsertMany(list: T[]) {
        const map = { ...this.entities() };
        for (const item of list) {
            map[item.id] = item;
        }
        const newIds = Array.from(new Set([...this.ids(), ...list.map(x => x.id)])).sort((a, b) => a - b);
        this.entities.set(map);
        this.ids.set(newIds);
    }

    protected upsertOne(item: T) {
        const exists = !!this.entities()[item.id];
        this.entities.set({ ...this.entities(), [item.id]: item });
        if (!exists) this.ids.set([...this.ids(), item.id].sort((a, b) => a - b));
    }

    protected remove(id: number) {
        if (!this.entities()[id]) return;
        const map = { ...this.entities() };
        delete map[id];
        this.entities.set(map);
        this.ids.set(this.ids().filter(x => x !== id));
    }

    protected replaceAll(list: T[]) {
        const map: Record<number, T> = {};
        const ids = list.map(x => (map[x.id] = x, x.id)).sort((a, b) => a - b);
        this.entities.set(map);
        this.ids.set(ids);
    }
}