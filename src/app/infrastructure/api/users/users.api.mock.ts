import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { UsersApi } from './users.api';
import { UserDTO, CreateUserRequest } from '@app/domain/models';

let SEQ = 6;

const data: UserDTO[] = [
  {
    id: 1,
    username: 'jdoe',
    name: 'John',
    lastname: 'Doe',
    workingHours: 40,
    email: 'jdoe@acme.test',
    role: 'ENGINEER',
    profilePhoto: 'jdoe.png',
    dni: 20100001,
  } as unknown as UserDTO,
  {
    id: 2,
    username: 'msmith',
    name: 'María',
    lastname: 'Smith',
    workingHours: 38,
    email: 'msmith@petromax.test',
    role: 'MANAGER',
    profilePhoto: 'msmith.jpg',
    dni: 20100002,
  } as unknown as UserDTO,
  {
    id: 3,
    username: 'ana.g',
    name: 'Ana',
    lastname: 'García',
    workingHours: 35,
    email: 'ana@aerolabs.test',
    role: 'TECH',
    profilePhoto: 'ana.png',
    dni: 20100003,
  } as unknown as UserDTO,
  {
    id: 4,
    username: 'luis',
    name: 'Luis',
    lastname: 'Pérez',
    workingHours: 40,
    email: 'luis@acme.test',
    role: 'ENGINEER',
    profilePhoto: undefined,
    dni: 20100004,
  } as unknown as UserDTO,
  {
    id: 5,
    username: 'carlos',
    name: 'Carlos',
    lastname: 'Lopez',
    workingHours: 30,
    email: 'carlos@globex.test',
    role: 'OPERATOR',
    profilePhoto: 'carlos.jpg',
    dni: 20100005,
  } as unknown as UserDTO,
  {
    id: 6,
    username: 'sofia',
    name: 'Sofía',
    lastname: 'Martínez',
    workingHours: 36,
    email: 'sofia@pm.test',
    role: 'ADMIN',
    profilePhoto: 'sofia.png',
    dni: 20100006,
  } as unknown as UserDTO,
];

@Injectable({
  providedIn: 'root',
})
export class UsersApiMock extends UsersApi {
  getAll(): Observable<UserDTO[]> {
    return of([...data]).pipe(delay(120));
  }

  getById(id: number): Observable<UserDTO> {
    return of(data.find((u) => u.id === id)).pipe(
      map((u) => {
        if (!u) throw new Error('User not found: ' + id);
        return u;
      }),
      delay(80),
    );
  }

  getByEmail(email: string): Observable<UserDTO> {
    return of(data.find((u) => u.email === email)).pipe(
      map((u) => {
        if (!u) throw new Error('User not found with email: ' + email);
        return u;
      }),
      delay(80),
    );
  }

  getByDni(dni: number): Observable<UserDTO> {
    const found = data.find((u) => (u as unknown as any).dni === dni);
    return of(found).pipe(
      map((u) => {
        if (!u) throw new Error('User not found with dni: ' + dni);
        return u;
      }),
      delay(80),
    );
  }

  create(payload: CreateUserRequest): Observable<UserDTO> {
    const created: UserDTO = {
      id: ++SEQ,
      username: payload.username,
      name: payload.name,
      lastname: payload.lastname,
      workingHours: payload.workingHours,
      email: payload.email,
      role: payload.role,
      profilePhoto: payload.profilePhoto,
    } as UserDTO;

    // keep dni for lookup in mock (store as extra prop)
    (created as unknown as any).dni = payload.dni;

    data.push(created);
    return of({ ...created }).pipe(delay(100));
  }

  delete(id: number): Observable<UserDTO> {
    const idx = data.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found: ' + id);
    const removed = data.splice(idx, 1)[0];
    return of(removed).pipe(delay(80));
  }
}
