import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectDetailPage } from './project-detail-page';
import { ProjectState } from '../../state/project-state';
import { ActivatedRoute, Router } from '@angular/router';

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
class ErrorStateStub {
  @Input() message = '';
  @Output() retry = new EventEmitter<void>();
}

describe('ProjectDetailPage', () => {
  let fixture: ComponentFixture<ProjectDetailPage>;
  let stateMock: any;
  let routerMock: any;
  let routeMock: any;

  beforeEach(async () => {
    routeMock = { snapshot: { paramMap: { get: vi.fn().mockReturnValue('5') } } };
    stateMock = {
      entityById: vi.fn().mockReturnValue(null),
      entityLoading: vi.fn().mockReturnValue(false),
      entityError: vi.fn().mockReturnValue(null),
      loadById: vi.fn(),
    };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ProjectDetailPage, SkeletonStub, ErrorStateStub],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: ProjectState, useValue: stateMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailPage);
  });

  it('cuando loading es true, muestra SkeletonStub', () => {
    stateMock.entityLoading.mockReturnValue(true);
    stateMock.entityError.mockReturnValue(null);
    fixture.detectChanges();
    const skeletonEl = fixture.nativeElement.querySelector('app-skeleton');
    expect(skeletonEl).toBeTruthy();
  });

  it('cuando error existe, muestra ErrorStateStub', () => {
    stateMock.entityLoading.mockReturnValue(false);
    stateMock.entityError.mockReturnValue('Err');
    fixture.detectChanges();
    const errorEl = fixture.nativeElement.querySelector('app-error-state');
    expect(errorEl).toBeTruthy();
  });
});
