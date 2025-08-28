import { Injectable } from "@angular/core";
import { CreatePlantCompanyRequest, PlantCompanyDTO } from "@app/domain/models";
import { PlantCompanyApi } from "./plant-company.api";
import { delay, map, Observable, of } from "rxjs";

let SEQ = 3;
const data: PlantCompanyDTO[] = [
    { id: 1, name: 'Planta A', city: 'La Plata', country: 'AR', company: { id: 1, name: 'Acme' } },
    { id: 2, name: 'Planta B', city: 'Bahía Blanca', country: 'AR', company: { id: 2, name: 'PetroMax' } },
    { id: 3, name: 'Planta C', city: 'Córdoba', country: 'AR', company: { id: 1, name: 'Acme' } },
];

@Injectable({
    providedIn: 'root',
})
export class PlantCompanyMockApi implements PlantCompanyApi {
    
    listAll(): Observable<PlantCompanyDTO[]> { return of([...data]).pipe(delay(150)); }
    
    getById(id: number): Observable<PlantCompanyDTO> {
        return of(data.find(d => d.id === id)).pipe(
            map(c => { if (!c) throw new Error('Not found plant-company with id: ' + id); return c; }),
            delay(100),
        );
    }

    listByCompany(companyId: number): Observable<PlantCompanyDTO[]> {
        return of(data.filter(d => d.company?.id === companyId))
            .pipe(delay(130));
    }

    create(dto: CreatePlantCompanyRequest): Observable<PlantCompanyDTO> {
        const created: PlantCompanyDTO = { id: ++SEQ, ...dto };
        data.push(created);
        return of({ ...created }).pipe(delay(120));    
    }

    update(id: number, dto: Partial<CreatePlantCompanyRequest>): Observable<PlantCompanyDTO> {
        const i = data.findIndex(d => d.id === id);
        if (i === -1) throw new Error('Not found plant-company with id: ' + id);
        data[i] = { ...data[i], ...dto };
        return of({ ...data[i] }).pipe(delay(120));    
    }

    delete(id: number): Observable<void> {
        const i = data.findIndex(d => d.id === id);
        if (i === -1) throw new Error('Not found plant-company with id: ' + id);
        data.splice(i, 1);
        return of(void 0).pipe(delay(80));    
    }
}