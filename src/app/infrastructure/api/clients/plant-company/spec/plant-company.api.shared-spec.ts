import type { PlantCompanyApi } from '../plant-company.api';
import type { CreatePlantCompanyRequest } from '@app/domain/models';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect } from 'vitest';

export function sharedPlantCompanyApiSpec(factory: () => PlantCompanyApi) {
  describe('PlantCompanyApi contract', () => {
    it('listAll: devuelve array (vacío o con data)', async () => {
      const api = factory();
      const list = await firstValueFrom(api.listAll());
      expect(Array.isArray(list)).toBe(true);
    });

    it('create: crea y retorna entidad con id', async () => {
      const api = factory();
      const dto: CreatePlantCompanyRequest = { name: 'Nueva Planta' };
      const created = await firstValueFrom(api.create(dto));
      expect(created.id).toBeTruthy();
      expect(created.name).toBe('Nueva Planta');
    });

    it('getById: obtiene la entidad recién creada', async () => {
      const api = factory();
      const dto: CreatePlantCompanyRequest = { name: 'Temporal' };
      const created = await firstValueFrom(api.create(dto));
      const byId = await firstValueFrom(api.getById(created.id));
      expect(byId.id).toBe(created.id);
      expect(byId.name).toBe('Temporal');
    });

    it('update: aplica parches parciales y conserva id', async () => {
      const api = factory();
      const created = await firstValueFrom(api.create({ name: 'Edit' }));
      const updated = await firstValueFrom(api.update(created.id, { city: 'La Plata' }));
      expect(updated.id).toBe(created.id);
      expect(updated.city).toBe('La Plata');
    });

    it('delete: completa (void) y luego getById rechaza', async () => {
      const api = factory();
      const created = await firstValueFrom(api.create({ name: 'Borrar' }));
      await expect(firstValueFrom(api.delete(created.id))).resolves.toBeUndefined();
      await expect(firstValueFrom(api.getById(created.id))).rejects.toBeDefined();
    });

    it('listByCompany: devuelve array (filtrado si la impl lo soporta)', async () => {
      const api = factory();
      const list = await firstValueFrom(api.listByCompany(123));
      expect(Array.isArray(list)).toBe(true);
    });
  });
}
