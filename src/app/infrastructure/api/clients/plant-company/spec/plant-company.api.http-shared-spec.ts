import { firstValueFrom } from 'rxjs';
import type { PlantCompanyApi } from '../plant-company.api';
import type { CreatePlantCompanyRequest, PlantCompanyDTO, ApiResponse } from '@app/domain/models';
import { HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';

export function sharedPlantCompanyApiHttpSpec(
  apiFactory: () => PlantCompanyApi,
  httpFactory: () => HttpTestingController,
  baseUrl: string,
) {
  describe('PlantCompanyApi HTTP contract', () => {
    it('listAll: GET /getAll', async () => {
      const api = apiFactory();
      const p = firstValueFrom(api.listAll());
      const req = httpFactory().expectOne(`${baseUrl}/getAll`);
      const body: ApiResponse<PlantCompanyDTO[]> = { status: 'OK', message: 'ok', data: [] };
      req.flush(body);
      await expect(p).resolves.toEqual([]);
    });

    it('create + getById + update + delete (flujo completo)', async () => {
      const api = apiFactory();
      const http = httpFactory();

      // create
      const createDto: CreatePlantCompanyRequest = { name: 'Nueva' };
      const createP = firstValueFrom(api.create(createDto));
      let req = http.expectOne(`${baseUrl}/create`);
      expect(req.request.method).toBe('POST');
      const created: PlantCompanyDTO = { id: 10, name: 'Nueva', clientContacts: [], company: null };
      req.flush({ status: 'OK', message: 'created', data: created } as ApiResponse<PlantCompanyDTO>);
      await expect(createP).resolves.toEqual(created);

      // getById
      const getP = firstValueFrom(api.getById(10));
      req = http.expectOne(`${baseUrl}/getById/10`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'OK', message: 'ok', data: created } as ApiResponse<PlantCompanyDTO>);
      await expect(getP).resolves.toEqual(created);

      // update
      const updP = firstValueFrom(api.update(10, { city: 'La Plata' }));
      req = http.expectOne(`${baseUrl}/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ id: 10, city: 'La Plata' });
      const updated: PlantCompanyDTO = { ...created, city: 'La Plata' };
      req.flush({ status: 'OK', message: 'updated', data: updated } as ApiResponse<PlantCompanyDTO>);
      await expect(updP).resolves.toEqual(updated);

      // delete
      const delP = firstValueFrom(api.delete(10));
      req = http.expectOne(`${baseUrl}/delete/10`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ status: 'OK', message: 'deleted', data: undefined as void } as ApiResponse<void>);
      await expect(delP).resolves.toBeUndefined();
    });

    it('listByCompany: GET /listByCompany/:companyId', async () => {
      const api = apiFactory();
      const p = firstValueFrom(api.listByCompany(5));
      const req = httpFactory().expectOne(`${baseUrl}/listByCompany/5`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'OK', message: 'ok', data: [] } as ApiResponse<PlantCompanyDTO[]>);
      await expect(p).resolves.toEqual([]);
    });
  });
}