import { Injectable } from "@angular/core";
import { ClientContactApi } from "./client-contact.api";
import { ClientContactDTO, CreateClientContactRequest } from "@app/domain/models";
import { delay, map, Observable, of } from "rxjs";

let SEQ = 4;
const data: ClientContactDTO[] = [
    { id: 1, name: 'Jorge', email: 'jorge@acme.test', company: { id: 1, name: 'Acme' }, plantCompany: { id: 1, name: 'Planta A' } },
    { id: 2, name: 'María', email: 'maria@pm.test', company: { id: 2, name: 'PetroMax' } },
    { id: 3, name: 'Ana', email: 'ana@acme.test', company: { id: 1, name: 'Acme' }, plantCompany: { id: 3, name: 'Planta C' } },
    { id: 4, name: 'Luis', email: 'luis@acme.test', company: { id: 1, name: 'Acme' } },
]

@Injectable({
    providedIn: 'root',
})
export class ClientContactMockApi implements ClientContactApi {

    listAll(): Observable<ClientContactDTO[]> {
        return of([...data]).pipe(delay(150));    
    }

    getById(id: number): Observable<ClientContactDTO> {
        return of(data.find(d => d.id === id)).pipe(
            map(c => { if (!c) throw new Error('Not found client-contact with id: ' + id); return c; }),
            delay(100),
        );    
    }

    listByCompany(companyId: number): Observable<ClientContactDTO[]> {
        return of(data.filter(d => d.company?.id === companyId))
            .pipe(
                map(c => { if (!c) throw new Error('Not found client-contacts for company with id: ' + companyId); return c; }),
                delay(130),
            );   
    }

    listByPlantCompany(plantCompanyId: number): Observable<ClientContactDTO[]> {
        return of(data.filter(d => d.plantCompany?.id === plantCompanyId))
            .pipe(
                map(c => { if (!c) throw new Error('Not found client-contacts for plant-company with id: ' + plantCompanyId); return c; }),
                delay(130),
            );
    }

    create(req: CreateClientContactRequest): Observable<ClientContactDTO> {
        const created: ClientContactDTO = { id: ++SEQ, ...req };
        data.push(created);
        return of({ ...created }).pipe(delay(120));    
    }

    update(id: number, dto: Partial<CreateClientContactRequest>): Observable<ClientContactDTO> {
        const i = data.findIndex(d => d.id === id);
        if (i === -1) throw new Error('Not found client-contact with id: ' + id);
        data[i] = { ...data[i], ...dto };
        return of({ ...data[i] }).pipe(delay(120));    
    }

    delete(id: number): Observable<void> {
        const i = data.findIndex(d => d.id === id);
        if (i === -1) throw new Error('Not found client-contact with id: ' + id);
        data.splice(i, 1);
        return of(void 0).pipe(delay(80));    
    }   
}