import { Injectable } from '@angular/core';
import { Company, CreateCompanyRequest, Industry } from '@app/domain/models';
import { CompanyApi } from './company.api';
import { delay, map, Observable, of } from 'rxjs';

let SEQ = 6;
const data: Company[] = [
  {
    id: 1,
    name: 'Acme S.A.',
    commercialName: 'Acme',
    logo: 'acme-logo.png',
    industry: 'EQUIPOS_INDUSTRIALES' as Industry,
    group: 'Acme Group',
  },
  {
    id: 2,
    name: 'PetroMax S.R.L.',
    commercialName: 'PetroMax',
    logo: 'petromax-logo.svg',
    industry: 'OIL_AND_GAS' as Industry,
    group: 'PetroMax Holdings',
  },
  {
    id: 3,
    name: 'AeroLabs International',
    commercialName: 'AeroLabs',
    logo: 'aerolabs.png',
    industry: 'AEROESPACIAL' as Industry,
    group: 'AeroLabs Group',
  },
  {
    id: 4,
    name: 'Globex Corporation',
    commercialName: 'Globex',
    logo: 'globex.jpg',
    industry: 'CONSTRUCCION' as Industry,
    group: 'Globex Group',
  },
  {
    id: 5,
    name: 'Solutions Ltd',
    commercialName: 'Solutions',
    logo: 'solutions.png',
    industry: 'EQUIPOS_INDUSTRIALES' as Industry,
    group: 'Solutions Group',
  },
  {
    id: 6,
    name: 'Transporte y Logística S.A.',
    commercialName: 'TyL',
    logo: 'tyl.svg',
    industry: 'TRANSPORTE' as Industry,
    group: 'TyL Holding',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CompanyMockApi implements CompanyApi {
  listAll(): Observable<Company[]> {
    return of([...data]).pipe(delay(150));
  }

  getById(id: number): Observable<Company> {
    return of(data.find((d) => d.id === id)).pipe(
      map((c) => {
        if (!c) throw new Error('Not found company with id: ' + id);
        return c;
      }),
      delay(100),
    );
  }

  create(dto: CreateCompanyRequest): Observable<Company> {
    const created: Company = { id: ++SEQ, ...dto };
    data.push(created);
    return of({ ...created }).pipe(delay(120));
  }

  update(id: number, dto: Partial<CreateCompanyRequest>): Observable<Company> {
    const i = data.findIndex((d) => d.id === id);
    if (i === -1) throw new Error('Not found company with id: ' + id);
    data[i] = { ...data[i], ...dto };
    return of({ ...data[i] }).pipe(delay(120));
  }

  delete(id: number): Observable<void> {
    const i = data.findIndex((d) => d.id === id);
    if (i === -1) throw new Error('Not found company with id: ' + id);
    data.splice(i, 1);
    return of(void 0).pipe(delay(80));
  }
}
