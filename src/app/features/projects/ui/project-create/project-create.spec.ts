import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ProjectCreate } from './project-create';
import { ProjectState } from '../../state/project-state';

@Component({
  selector: 'project-form',
  standalone: true,
  template: '',
})
class ProjectFormStub {
  @Output() submit = new EventEmitter<Record<string, unknown>>();
  @Output() cancel = new EventEmitter<void>();
}

describe('ProjectCreate', () => {
  let fixture: ComponentFixture<ProjectCreate>;
  let stateMock: {
    create: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    stateMock = {
      create: vi.fn().mockResolvedValue(10),
    };
    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectCreate, ProjectFormStub],
      providers: [
        { provide: ProjectState, useValue: stateMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCreate);
    fixture.detectChanges();
  });

  it('should render title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Crear Proyecto');
  });

  it('should call state.create and navigate on submit', async () => {
    const form = fixture.debugElement.query(By.directive(ProjectFormStub)).componentInstance as ProjectFormStub;
    form.submit.emit({ name: 'Nuevo' });
    // wait microtask queue to flush promise
    await Promise.resolve();
    expect(stateMock.create).toHaveBeenCalledWith(1, { name: 'Nuevo' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/projects', 10]);
  });

  it('should navigate back on cancel', () => {
    const form = fixture.debugElement.query(By.directive(ProjectFormStub)).componentInstance as ProjectFormStub;
    form.cancel.emit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/projects']);
  });
});
