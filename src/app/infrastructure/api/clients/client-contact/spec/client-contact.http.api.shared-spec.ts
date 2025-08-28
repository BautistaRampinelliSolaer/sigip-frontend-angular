import { firstValueFrom } from 'rxjs';
import type { ClientContactApi } from '../client-contact.api';
import type { ClientContactDTO, CreateClientContactRequest, ApiResponse } from '@app/domain/models';
import { HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';

export function sharedClientContactApiHttpSpec(
  apiFactory: () => ClientContactApi,
  httpFactory: () => HttpTestingController,
  baseUrl: string,
) {
  describe('ClientContactApi HTTP contract', () => {
    it('listAll: GET /all', async () => {
      const api = apiFactory();
      const p = firstValueFrom(api.listAll());
      const req = httpFactory().expectOne(`${baseUrl}/all`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'OK', message: 'ok', data: [] } as ApiResponse<ClientContactDTO[]>);
      await expect(p).resolves.toEqual([]);
    });

    it('create → getById → update → delete', async () => {
      const api = apiFactory();
      const http = httpFactory();

      // create
      const dto: CreateClientContactRequest = { name: 'Julián', email: 'julian@test.dev' };
      const createP = firstValueFrom(api.create(dto));
      let req = http.expectOne(`${baseUrl}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      const created: ClientContactDTO = { id: 10, name: 'Julián', email: 'julian@test.dev' };
      req.flush({ status: 'OK', message: 'created', data: created } as ApiResponse<ClientContactDTO>);
      await expect(createP).resolves.toEqual(created);

      // getById
      const getP = firstValueFrom(api.getById(10));
      req = http.expectOne(`${baseUrl}/10`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'OK', message: 'ok', data: created } as ApiResponse<ClientContactDTO>);
      await expect(getP).resolves.toEqual(created);

      // update
      const updP = firstValueFrom(api.update(10, { city: 'La Plata' }));
      req = http.expectOne(`${baseUrl}/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ id: 10, city: 'La Plata' });
      const updated: ClientContactDTO = { ...created, city: 'La Plata' };
      req.flush({ status: 'OK', message: 'updated', data: updated } as ApiResponse<ClientContactDTO>);
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
      const p = firstValueFrom(api.listByCompany(7));
      const req = httpFactory().expectOne(`${baseUrl}/listByCompany/7`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'OK', message: 'ok', data: [] } as ApiResponse<ClientContactDTO[]>);
      await expect(p).resolves.toEqual([]);
    });

    it('listByPlantCompany: GET /listByPlantCompany/:plantCompanyId', async () => {
      const api = apiFactory();
      const p = firstValueFrom(api.listByPlantCompany(3));
      const req = httpFactory().expectOne(`${baseUrl}/listByPlantCompany/3`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 'OK', message: 'ok', data: [] } as ApiResponse<ClientContactDTO[]>);
      await expect(p).resolves.toEqual([]);
    });
  });
}
