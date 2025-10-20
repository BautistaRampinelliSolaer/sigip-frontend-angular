import { Injectable } from '@angular/core';
import { CreatePlantCompanyRequest, ObjectMiniDTO, PlantCompanyDTO } from '@app/domain/models';
import { PlantCompanyApi } from './plant-company.api';
import { delay, map, Observable, of } from 'rxjs';

let SEQ = 6;
const data: PlantCompanyDTO[] = [
  {
    id: 1,
    name: 'Planta A',
    phone: '+54-11-4000-0001',
    email: 'planta.a@acme.test',
    country: 'Argentina',
    city: 'Buenos Aires',
    company: { id: 1, name: 'Acme S.A.', type: 'company' } as ObjectMiniDTO,
    clientContacts: [
      { id: 1, name: 'Jorge' },
      { id: 4, name: 'Luis' },
    ] as ObjectMiniDTO[],
  },
  {
    id: 2,
    name: 'Planta B',
    phone: '+54-11-4000-0002',
    email: 'planta.b@petromax.test',
    country: 'Argentina',
    city: 'La Plata',
    company: { id: 2, name: 'PetroMax S.R.L.', type: 'company' } as ObjectMiniDTO,
    clientContacts: [
      { id: 2, name: 'María' },
      { id: 6, name: 'Sofía' },
    ] as ObjectMiniDTO[],
  },
  {
    id: 3,
    name: 'Planta C',
    phone: '+34-91-200-3003',
    email: 'planta.c@aerolabs.test',
    country: 'Spain',
    city: 'Madrid',
    company: { id: 3, name: 'AeroLabs International', type: 'company' } as ObjectMiniDTO,
    clientContacts: [{ id: 3, name: 'Ana' }] as ObjectMiniDTO[],
  },
  {
    id: 4,
    name: 'Planta D',
    phone: '+1-212-555-0104',
    email: 'planta.d@globex.test',
    country: 'USA',
    city: 'New York',
    company: { id: 4, name: 'Globex Corporation', type: 'company' } as ObjectMiniDTO,
    clientContacts: [
      { id: 5, name: 'Carlos' },
      { id: 8, name: 'Lucía' },
    ] as ObjectMiniDTO[],
  },
  {
    id: 5,
    name: 'Planta E',
    phone: '+57-1-600-5005',
    email: 'planta.e@acme.test',
    country: 'Colombia',
    city: 'Bogotá',
    company: { id: 1, name: 'Acme S.A.', type: 'company' } as ObjectMiniDTO,
    clientContacts: [{ id: 7, name: 'Diego' }] as ObjectMiniDTO[],
  },
  {
    id: 6,
    name: 'Planta F',
    phone: '+44-20-7000-6006',
    email: 'planta.f@solutions.test',
    country: 'United Kingdom',
    city: 'London',
    company: { id: 5, name: 'Solutions Ltd', type: 'company' } as ObjectMiniDTO,
    clientContacts: [{ id: 9, name: 'Marcos' }] as ObjectMiniDTO[],
  },
];

@Injectable({
  providedIn: 'root',
})
export class PlantCompanyMockApi implements PlantCompanyApi {
  listAll(): Observable<PlantCompanyDTO[]> {
    return of([...data]).pipe(delay(150));
  }

  getById(id: number): Observable<PlantCompanyDTO> {
    return of(data.find((d) => d.id === id)).pipe(
      map((c) => {
        if (!c) throw new Error('Not found plant-company with id: ' + id);
        return c;
      }),
      delay(100),
    );
  }

  listByCompany(companyId: number): Observable<PlantCompanyDTO[]> {
    return of(data.filter((d) => d.company?.id === companyId)).pipe(delay(130));
  }

  create(dto: CreatePlantCompanyRequest): Observable<PlantCompanyDTO> {
    const created: PlantCompanyDTO = { id: ++SEQ, ...dto };
    data.push(created);
    return of({ ...created }).pipe(delay(120));
  }

  update(id: number, dto: Partial<CreatePlantCompanyRequest>): Observable<PlantCompanyDTO> {
    const i = data.findIndex((d) => d.id === id);
    if (i === -1) throw new Error('Not found plant-company with id: ' + id);
    data[i] = { ...data[i], ...dto };
    return of({ ...data[i] }).pipe(delay(120));
  }

  delete(id: number): Observable<void> {
    const i = data.findIndex((d) => d.id === id);
    if (i === -1) throw new Error('Not found plant-company with id: ' + id);
    data.splice(i, 1);
    return of(void 0).pipe(delay(80));
  }
}
