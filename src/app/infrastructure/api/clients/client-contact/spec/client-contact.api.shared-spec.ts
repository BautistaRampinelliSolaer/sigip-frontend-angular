import type { ClientContactApi } from '../client-contact.api';
import type { CreateClientContactRequest } from '@app/domain/models';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect } from 'vitest';

export function sharedClientContactApiSpec(factory: () => ClientContactApi) {
  describe('ClientContactApi contract', () => {
    it('listAll: devuelve array', async () => {
      const api = factory();
      const res = await firstValueFrom(api.listAll());
      expect(Array.isArray(res)).toBe(true);
    });

    it('create -> getById -> update -> delete', async () => {
      const api = factory();

      // create
      const dto: CreateClientContactRequest = { name: 'Julián', email: 'julian@test.dev' };
      const created = await firstValueFrom(api.create(dto));
      expect(created.id).toBeTruthy();
      expect(created.name).toBe('Julián');

      // getById
      const byId = await firstValueFrom(api.getById(created.id));
      expect(byId.id).toBe(created.id);

      // update
      const updated = await firstValueFrom(api.update(created.id, { city: 'La Plata' }));
      expect(updated.id).toBe(created.id);
      expect(updated.city).toBe('La Plata');

      // delete
      await expect(firstValueFrom(api.delete(created.id))).resolves.toBeUndefined();
      await expect(firstValueFrom(api.getById(created.id))).rejects.toBeDefined();
    });

    it('listByCompany: return array (it can be empty)', async () => {
      const api = factory();
      const res = await firstValueFrom(api.listByCompany(1));
      expect(Array.isArray(res)).toBe(true);
    });

    it('listByPlantCompany: return array (it can be empty)', async () => {
      const api = factory();
      const res = await firstValueFrom(api.listByPlantCompany(1));
      expect(Array.isArray(res)).toBe(true);
    });
  });
}
