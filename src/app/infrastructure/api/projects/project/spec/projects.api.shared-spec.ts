import { describe, expect, it } from 'vitest';
import { ProjectsApi } from '../projects.api';
import { firstValueFrom } from 'rxjs';
import { CreateProjectRequest, ProjectDTO, ProjectMiniDTO } from '@app/domain/models';

export function sharedProjectsApiSpec(factory: () => ProjectsApi) {
  describe('ProjectsApi contract', () => {
    it('getAll: return array', async () => {
      const api = factory();
      const res: ProjectDTO[] = await firstValueFrom(api.getAll());
      expect(Array.isArray(res)).toBe(true);
    });

    it('create -> getById -> update -> delete', async () => {
      const api = factory();

      // create
      const dto: CreateProjectRequest = {
        code: 'A1',
        name: 'Ala nevada',
        description: 'description',
        standards: '',
        responsibleId: 1,
        state: '',
        reviewerId: 1,
        type: '',
      };
      const userId = 1;
      const created: ProjectDTO = await firstValueFrom(api.create(userId, dto));
      expect(created.id).toBeTruthy();
      expect(created.name).toBe('Ala nevada');

      // getById
      const byId: ProjectDTO = await firstValueFrom(api.getById(created.id));
      expect(byId.id).toBe(created.id);
      expect(byId.code).toBe('A1');

      // update
      const updated: ProjectDTO = await firstValueFrom(
        api.edit(created.id, { description: 'new description' }),
      );
      expect(updated.id).toBe(created.id);
      expect(updated.description).toBe('new description');

      // delete
      await expect(firstValueFrom(api.delete(userId, created.id))).resolves.toBeUndefined();
      await expect(firstValueFrom(api.getById(created.id))).rejects.toBeDefined();
    });

    it('Get all mini: return array', async () => {
      const api = factory();
      const res: ProjectMiniDTO[] = await firstValueFrom(api.getAllMini());
      expect(Array.isArray(res)).toBe(true);
    });

    it('Get by state: return array', async () => {
      const api = factory();
      const res: ProjectDTO[] = await firstValueFrom(api.getByState(''));
      expect(Array.isArray(res)).toBe(true);
    });

    it('Get by responsible: return array', async () => {
      const api = factory();
      const res: ProjectDTO[] = await firstValueFrom(api.getByResponsible(2));
      expect(Array.isArray(res)).toBe(true);
    });

    it('Get by code', async () => {
      const api = factory();

      // create
      const dto: CreateProjectRequest = {
        code: 'A1',
        name: 'Ala nevada',
        description: 'description',
        standards: '',
        responsibleId: 1,
        state: '',
        reviewerId: 1,
        type: '',
      };
      const userId = 1;
      await firstValueFrom(api.create(userId, dto));
      const found: ProjectDTO = await firstValueFrom(api.getByCode('A1'));
      expect(found.code).toBe('A1');
      expect(found.name).toBe('Ala nevada');
    });
  });
}
