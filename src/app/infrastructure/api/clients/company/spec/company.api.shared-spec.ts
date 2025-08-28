import type { CompanyApi } from '../company.api';
import type { Company, CreateCompanyRequest } from '@app/domain/models';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect } from 'vitest';

export function sharedCompanyApiSpec(factory: () => CompanyApi) {
  describe('CompanyApi contract', () => {
    it('listAll: devuelve array', async () => {
      const api = factory();
      const list = await firstValueFrom(api.listAll());
      expect(Array.isArray(list)).toBe(true);
    });

    it('create: crea y retorna entidad con id', async () => {
      const api = factory();
      const dto: CreateCompanyRequest = { name: 'Nueva Co.' };
      const created = await firstValueFrom(api.create(dto));
      expect(created.id).toBeTruthy();
      expect(created.name).toBe('Nueva Co.');
    });

    it('getById: obtiene la entidad recién creada', async () => {
      const api = factory();
      const created = await firstValueFrom(api.create({ name: 'Temporal Co.' }));
      const byId = await firstValueFrom(api.getById(created.id));
      expect(byId.id).toBe(created.id);
      expect(byId.name).toBe('Temporal Co.');
    });

    it('update: aplica parches parciales y conserva id', async () => {
      const api = factory();
      const created = await firstValueFrom(api.create({ name: 'Edit Co.' }));
      const updated = await firstValueFrom(api.update(created.id, { group: 'Holding' }));
      expect(updated.id).toBe(created.id);
      expect(updated.group).toBe('Holding');
    });

    it('delete: completa (void) y luego getById rechaza', async () => {
      const api = factory();
      const created = await firstValueFrom(api.create({ name: 'ToDelete Co.' }));
      await expect(firstValueFrom(api.delete(created.id))).resolves.toBeUndefined();
      await expect(firstValueFrom(api.getById(created.id))).rejects.toBeDefined();
    });
  });
}
