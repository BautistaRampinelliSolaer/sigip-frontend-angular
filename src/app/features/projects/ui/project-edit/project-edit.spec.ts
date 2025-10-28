import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ProjectEdit } from './project-edit';
import { ProjectState } from '../../state/project-state';

@Component({
  standalone: true,
  template: `<app-project-edit></app-project-edit>`,
  imports: [ProjectEdit],
})
class HostProjectEditTest {}

@Component({
  selector: 'project-form',
  standalone: true,
  template: '',
})
class ProjectFormStub {
  @Output() submit = new EventEmitter<unknown>();
}

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: '',
})
class SkeletonStub {}

@Component({
  selector: 'app-error-state',
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
      entityById: vi.fn().mockReturnValue(null),
      entityLoading: vi.fn().mockReturnValue(false),
      entityError: vi.fn().mockReturnValue(null),
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

  it('should render ProjectForm and call save when project exists', async () => {
    const proj = { id: 123, code: 'C', name: 'Name' };
    storeMock.entityById.mockReturnValue(proj);

    fixture.detectChanges();

    const editDebug = fixture.debugElement.query(By.directive(ProjectEdit));
    expect(editDebug).toBeTruthy();

    const formDebug = editDebug.query(By.directive(ProjectFormStub));
    expect(formDebug).toBeTruthy();

    const formStub = formDebug.componentInstance as ProjectFormStub;
    formStub.submit.emit({ name: 'Updated' });
    await Promise.resolve();
    expect(storeMock.edit).toHaveBeenCalledWith(123, { name: 'Updated' });
  });

  it('should render SkeletonStub when loading', () => {
    storeMock.entityLoading.mockReturnValue(true);
    fixture.detectChanges();

    const editDebug = fixture.debugElement.query(By.directive(ProjectEdit));
    expect(editDebug.query(By.directive(SkeletonStub))).toBeTruthy();
  });

  it('should render ErrorStateStub when error', () => {
    storeMock.entityError.mockReturnValue('Err');
    fixture.detectChanges();

    const editDebug = fixture.debugElement.query(By.directive(ProjectEdit));
    expect(editDebug.query(By.directive(ErrorStateStub))).toBeTruthy();
  });
});
