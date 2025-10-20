import { createLifecycleRequest, lifecycleDTO } from "@app/domain/models";
import { Observable } from "rxjs";

export abstract class LifecycleApi {
    abstract getAll(): Observable<lifecycleDTO[]>;
    abstract getById(id: number): Observable<lifecycleDTO>;
    abstract getByAssignedId(assignedId: number): Observable<lifecycleDTO[]>;
    abstract create(createLifecycleRequest: createLifecycleRequest): Observable<lifecycleDTO>;
    abstract update(updated: Partial<lifecycleDTO>): Observable<lifecycleDTO>;
    abstract delete(id: number): Observable<void>;
}