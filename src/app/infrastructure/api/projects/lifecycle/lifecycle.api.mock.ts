import { Injectable } from '@angular/core';
import { LifecycleApi } from './lifecycle.api';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { lifecycleDTO, createLifecycleRequest, ObjectMiniDTO } from '@app/domain/models';

let SEQ = 3;

const SAMPLE_OBJ: ObjectMiniDTO = { id: 1, name: 'Project #1' };

const data: lifecycleDTO[] = [
  {
    id: 1,
    objAssigned: SAMPLE_OBJ,
    previousState: 'DRAFT',
    newState: 'IN_REVIEW',
    description: 'Initial transition to review',
    type: 'MANUAL',
  },
  {
    id: 2,
    objAssigned: { id: 2, name: 'Project #2' },
    previousState: 'IN_REVIEW',
    newState: 'APPROVED',
    description: 'Approved by manager',
    type: 'AUTOMATIC',
  },
];

@Injectable({
  providedIn: 'root',
})
export class LifecycleApiMock extends LifecycleApi {
  getAll(): Observable<lifecycleDTO[]> {
    return of([...data]).pipe(delay(150));
  }

  getById(id: number): Observable<lifecycleDTO> {
    return of(data.find(d => d.id === id)).pipe(
      map(d => {
        if (!d) throw new Error('Lifecycle not found with id: ' + id);
        return d;
      }),
      delay(120),
    );
  }

  getByAssignedId(assignedId: number): Observable<lifecycleDTO[]> {
    const matched = data.filter(d => d.objAssigned?.id === assignedId);
    return of(matched).pipe(delay(120));
  }

  create(req: createLifecycleRequest): Observable<lifecycleDTO> {
    const created: lifecycleDTO = {
      id: ++SEQ,
      objAssigned: { id: req.objAssignedId, name: `Obj #${req.objAssignedId}` } as ObjectMiniDTO,
      previousState: req.previousState,
      newState: req.newState,
      description: req.description,
      type: req.type,
    };
    data.push(created);
    return of({ ...created }).pipe(delay(140));
  }

  update(updated: Partial<lifecycleDTO>): Observable<lifecycleDTO> {
    if (!updated.id) throw new Error('update payload must include id');
    const i = data.findIndex(d => d.id === updated.id);
    if (i === -1) throw new Error('Lifecycle not found with id: ' + updated.id);
    data[i] = { ...data[i], ...updated };
    return of({ ...data[i] }).pipe(delay(120));
  }

  delete(id: number): Observable<void> {
    const i = data.findIndex(d => d.id === id);
    if (i === -1) throw new Error('Lifecycle not found with id: ' + id);
    data.splice(i, 1);
    return of(void 0).pipe(delay(80));
  }
}