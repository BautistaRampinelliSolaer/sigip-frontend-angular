import { Injectable } from '@angular/core';
import { ClientContactApi } from './client-contact.api';
import { ClientContactDTO, CreateClientContactRequest } from '@app/domain/models';
import { delay, map, Observable, of } from 'rxjs';

let SEQ = 9;
const data: ClientContactDTO[] = [
  {
    id: 1,
    name: 'Jorge',
    email: 'jorge@acme.test',
    phone: '+54-11-5555-0001',
    cellphone: '+54-9-11-6000-0001',
    number_intern: 'A-101',
    country: 'Argentina',
    city: 'Buenos Aires',
    company: { id: 1, name: 'Acme', type: 'company' },
    plantCompany: { id: 1, name: 'Planta A', type: 'plantCompany' },
  },
  {
    id: 2,
    name: 'María',
    email: 'maria@pm.test',
    phone: '+54-11-5555-0002',
    cellphone: '+54-9-11-6000-0002',
    number_intern: 'B-202',
    country: 'Argentina',
    city: 'La Plata',
    company: { id: 2, name: 'PetroMax', type: 'company' },
    plantCompany: { id: 2, name: 'Planta B', type: 'plantCompany' },
  },
  {
    id: 3,
    name: 'Ana',
    email: 'ana@acme.test',
    phone: '+54-11-5555-0003',
    cellphone: '+54-9-11-6000-0003',
    number_intern: 'C-303',
    country: 'Argentina',
    city: 'Rosario',
    company: { id: 1, name: 'Acme', type: 'company' },
    plantCompany: { id: 3, name: 'Planta C', type: 'plantCompany' },
  },
  {
    id: 4,
    name: 'Luis',
    email: 'luis@acme.test',
    phone: '+54-11-5555-0004',
    cellphone: '+54-9-11-6000-0004',
    number_intern: 'A-102',
    country: 'Argentina',
    city: 'Buenos Aires',
    company: { id: 1, name: 'Acme', type: 'company' },
    plantCompany: { id: 1, name: 'Planta A', type: 'plantCompany' },
  },
  {
    id: 5,
    name: 'Carlos',
    email: 'carlos@globex.test',
    phone: '+1-212-555-0105',
    cellphone: '+1-212-555-1105',
    number_intern: 'D-404',
    country: 'USA',
    city: 'New York',
    company: { id: 3, name: 'Globex', type: 'company' },
    plantCompany: { id: 4, name: 'Planta D', type: 'plantCompany' },
  },
  {
    id: 6,
    name: 'Sofía',
    email: 'sofia@pm.test',
    phone: '+54-11-5555-0006',
    cellphone: '+54-9-11-6000-0006',
    number_intern: 'B-203',
    country: 'Argentina',
    city: 'La Plata',
    company: { id: 2, name: 'PetroMax', type: 'company' },
    plantCompany: { id: 2, name: 'Planta B', type: 'plantCompany' },
  },
  {
    id: 7,
    name: 'Diego',
    email: 'diego@acme.test',
    phone: '+57-1-600-5007',
    cellphone: '+57-3-700-6007',
    number_intern: 'E-505',
    country: 'Colombia',
    city: 'Bogotá',
    company: { id: 1, name: 'Acme', type: 'company' },
    plantCompany: { id: 5, name: 'Planta E', type: 'plantCompany' },
  },
  {
    id: 8,
    name: 'Lucía',
    email: 'lucia@globex.test',
    phone: '+1-212-555-0108',
    cellphone: '+1-212-555-1108',
    number_intern: 'D-405',
    country: 'USA',
    city: 'New York',
    company: { id: 3, name: 'Globex', type: 'company' },
    plantCompany: { id: 4, name: 'Planta D', type: 'plantCompany' },
  },
  {
    id: 9,
    name: 'Marcos',
    email: 'marcos@solutions.test',
    phone: '+44-20-7000-6009',
    cellphone: '+44-7700-900009',
    number_intern: 'F-606',
    country: 'United Kingdom',
    city: 'London',
    company: { id: 4, name: 'Solutions Ltd', type: 'company' },
    plantCompany: { id: 6, name: 'Planta F', type: 'plantCompany' },
  },
];

@Injectable({
  providedIn: 'root',
})
export class ClientContactMockApi implements ClientContactApi {
  listAll(): Observable<ClientContactDTO[]> {
    return of([...data]).pipe(delay(150));
  }

  getById(id: number): Observable<ClientContactDTO> {
    return of(data.find((d) => d.id === id)).pipe(
      map((c) => {
        if (!c) throw new Error('Not found client-contact with id: ' + id);
        return c;
      }),
      delay(100),
    );
  }

  listByCompany(companyId: number): Observable<ClientContactDTO[]> {
    return of(data.filter((d) => d.company?.id === companyId)).pipe(
      map((c) => {
        if (!c) throw new Error('Not found client-contacts for company with id: ' + companyId);
        return c;
      }),
      delay(130),
    );
  }

  listByPlantCompany(plantCompanyId: number): Observable<ClientContactDTO[]> {
    return of(data.filter((d) => d.plantCompany?.id === plantCompanyId)).pipe(
      map((c) => {
        if (!c)
          throw new Error('Not found client-contacts for plant-company with id: ' + plantCompanyId);
        return c;
      }),
      delay(130),
    );
  }

  create(req: CreateClientContactRequest): Observable<ClientContactDTO> {
    const created: ClientContactDTO = { id: ++SEQ, ...req };
    data.push(created);
    return of({ ...created }).pipe(delay(120));
  }

  update(id: number, dto: Partial<CreateClientContactRequest>): Observable<ClientContactDTO> {
    const i = data.findIndex((d) => d.id === id);
    if (i === -1) throw new Error('Not found client-contact with id: ' + id);
    data[i] = { ...data[i], ...dto };
    return of({ ...data[i] }).pipe(delay(120));
  }

  delete(id: number): Observable<void> {
    const i = data.findIndex((d) => d.id === id);
    if (i === -1) throw new Error('Not found client-contact with id: ' + id);
    data.splice(i, 1);
    return of(void 0).pipe(delay(80));
  }
}
