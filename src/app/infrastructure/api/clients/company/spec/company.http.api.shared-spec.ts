import { firstValueFrom } from 'rxjs';
import type { CompanyApi } from '../company.api';
import type { Company, CreateCompanyRequest, ApiResponse } from '@app/domain/models';
import { HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';

export function sharedCompanyApiHttpSpec(
  apiFactory: () => CompanyApi,
  httpFactory: () => HttpTestingController,
  baseUrl: string,
) {
  describe('CompanyApi HTTP contract', () => {
    it('listAll: GET /all', async () => {
      const api = apiFactory();
      const p = firstValueFrom(api.listAll());
      const req = httpFactory().expectOne(`${baseUrl}/all`);
      expect(req.request.method).toBe('GET');

      const body: ApiResponse<Company[]> = { status: 'OK', message: 'ok', data: [] };
      req.flush(body);
      await expect(p).resolves.toEqual([]);
    });

    it('create + getById + update + delete (flujo completo)', async () => {
      const api = apiFactory();
      const http = httpFactory();

      // create
      const dto: CreateCompanyRequest = { name: 'Nueva Co.' };
      const createP = firstValueFrom(api.create(dto));
      let req = http.expectOne(`${baseUrl}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      const created: Company = { id: 10, name: 'Nueva Co.' };
      req.flush({ status: 'OK', message: 'created', data: created } as ApiResponse<Company>);
      await expect(createP).resolves.toEqual(created);

      // getById
      const getP = firstValueFrom(api.getById(10));
      req = http.expectOne(`${baseUrl}/10`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'OK', message: 'ok', data: created } as ApiResponse<Company>);
      await expect(getP).resolves.toEqual(created);

      // update
      const updP = firstValueFrom(api.update(10, { group: 'Holding' }));
      req = http.expectOne(`${baseUrl}/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ id: 10, group: 'Holding' });
      const updated: Company = { ...created, group: 'Holding' };
      req.flush({ status: 'OK', message: 'updated', data: updated } as ApiResponse<Company>);
      await expect(updP).resolves.toEqual(updated);

      // delete
      const delP = firstValueFrom(api.delete(10));
      req = http.expectOne(`${baseUrl}/delete/10`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ status: 'OK', message: 'deleted', data: undefined as void } as ApiResponse<void>);
      await expect(delP).resolves.toBeUndefined();
    });
  });
}
