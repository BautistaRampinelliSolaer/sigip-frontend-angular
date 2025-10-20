import { CreateUserRequest, UserDTO } from '@app/domain/models';
import { Observable } from 'rxjs';

export abstract class UsersApi {
  abstract getAll(): Observable<UserDTO[]>;
  abstract getById(id: number): Observable<UserDTO>;
  abstract getByEmail(email: string): Observable<UserDTO>;
  abstract getByDni(dni: number): Observable<UserDTO>;
  abstract create(payload: CreateUserRequest): Observable<UserDTO>;
  abstract delete(id: number): Observable<UserDTO>;
}
