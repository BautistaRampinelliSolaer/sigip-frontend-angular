// project-edit-host.spec.ts
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ProjectEdit } from './project-edit';
import { ProjectState } from '../../state/project-state';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template: `<app-project-edit></app-project-edit>`,
  imports: [ProjectEdit],
})
class HostProjectEditTest {}

// Stub for ProjectForm
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'project-form',
  standalone: true,
  template: '',
})
class ProjectFormStub {
  @Output() submit = new EventEmitter<any>();
}

// Stub for Skeleton
@Component({
  selector: 'skeleton',
  standalone: true,
  template: '',
})
class SkeletonStub {}

// Stub for ErrorState
@Component({
  selector: 'error-state',
  standalone: true,
  template: '',
})
class ErrorStateStub {}

describe('ProjectEdit (host)', () => {
  let fixture: ComponentFixture<HostProjectEditTest>;
  let storeMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(async () => {
    routeMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('123'),
        },
      },
    };
    storeMock = {
      entityById: () => null,
      entityLoading: () => false,
      entityError: () => null,
      loadById: vi.fn(),
      edit: vi.fn().mockResolvedValue(undefined),
    };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HostProjectEditTest, ProjectFormStub, SkeletonStub, ErrorStateStub],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: ProjectState, useValue: storeMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostProjectEditTest);
    fixture.detectChanges();
  });

  it('cuando project existe, muestra ProjectForm stub y save via submit', () => {
    const proj = { id: 123, code: 'C', name: 'Name' };
    storeMock.entityById = () => proj;

    fixture.detectChanges();

    const editDebug = fixture.debugElement.query(By.directive(ProjectEdit));
    expect(editDebug).toBeTruthy();

    const formDebug = editDebug.query(By.directive(ProjectFormStub));
    expect(formDebug).toBeTruthy();

    const formStub = formDebug.componentInstance as ProjectFormStub;
    formStub.submit.emit({ name: 'Updated' });
    expect(storeMock.edit).toHaveBeenCalledWith(123, { name: 'Updated' });
  });

  it('cuando loading true, muestra SkeletonStub', () => {
    storeMock.entityLoading = () => true;
    fixture.detectChanges();

    const editDebug = fixture.debugElement.query(By.directive(ProjectEdit));
    expect(editDebug.query(By.directive(SkeletonStub))).toBeTruthy();
  });

  it('cuando hay error, muestra ErrorStateStub', () => {
    storeMock.entityError = () => 'Err';
    fixture.detectChanges();

    const editDebug = fixture.debugElement.query(By.directive(ProjectEdit));
    expect(editDebug.query(By.directive(ErrorStateStub))).toBeTruthy();
  });
});
