import { describe, it, beforeEach, expect } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProjectForm } from './project-form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectDTO } from '@app/domain/models';
import { input } from '@angular/core';

const MOCK: ProjectDTO = {
  id: 1,
  code: 'PRJ-001',
  name: 'Proyecto Test',
  company: { id: 10, name: 'Comp', type: '' },
  plantCompany: { id: 11, name: 'Planta', type: '' },
  clientContact: { id: 12, name: 'Contacto', type: '' },
  documents: new Set(),
  creationDate: '2025-10-07T00:00:00',
  folderPath: '',
  image: '',
  keyword: '',
  description: 'Desc test',
  observations: new Set(),
  profiles: '',
  modelingTechniques: '',
  standards: '',
  responsible: { id: 5, name: 'Resp', type: '' },
  state: 'IN_PROGRESS',
  budget: { id: 20, name: 'Budget', type: '' },
  corrector: { id: 13, name: 'Corr', type: '' },
  reviewer: { id: 14, name: 'Rev', type: '' },
  parentProject: undefined,
  type: '',
};

describe('ProjectForm', () => {
  let fixture: ComponentFixture<ProjectForm>;
  let component: ProjectForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectForm, ReactiveFormsModule, MatInputModule, MatSelectModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectForm);
    component = fixture.componentInstance;
  });

  it('inicia vacío cuando project es null', () => {
    fixture.detectChanges(); // sin setInput
    expect(component.form.value).toEqual({
      code: '',
      name: '',
      state: '',
      responsibleId: null,
      description: '',
    });
  });

  it('patcha valores cuando recibe project input', () => {
    // establecer el input signal
    fixture.componentRef.setInput('project', MOCK);
    fixture.detectChanges();

    expect(component.form.value).toEqual({
      code: MOCK.code,
      name: MOCK.name,
      state: MOCK.state ?? '',
      responsibleId: MOCK.responsible?.id ?? null,
      description: MOCK.description ?? '',
    });
  });

  it('onSubmit emite valores válidos cuando el form es válido', () => {
    fixture.detectChanges();
    let emitted: Partial<ProjectDTO> | undefined;
    component.submit.subscribe((v) => (emitted = v));

    component.form.controls.code.setValue('A1');
    component.form.controls.name.setValue('Test Name');

    // deberíamos dar valores mínimos para que sea válido
    component.onSubmit();

    expect(emitted).toEqual({
      code: 'A1',
      name: 'Test Name',
      state: '',
      responsibleId: null,
      description: '',
    });
  });

  it('onSubmit no emite si form inválido y marca controles como touched', () => {
    fixture.detectChanges();
    let emitted = false;
    component.submit.subscribe(() => (emitted = true));

    // code y name están vacíos → inválido
    component.onSubmit();

    expect(emitted).toBe(false);
    expect(component.form.controls.code.touched).toBe(true);
    expect(component.form.controls.name.touched).toBe(true);
  });
});
