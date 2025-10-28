import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ProjectsTable } from './projects-table';
import { ProjectDTO } from '@app/domain/models';
import { Key, ProjectsColumnsStore } from '../projects-columns.store';
import { ProjectState } from '../../state/project-state';

@Component({
  standalone: true,
  template: `<app-projects-table></app-projects-table>`,
  imports: [ProjectsTable],
})
class HostProjectsTableTest {}

@Component({
  selector: 'app-data-table',
  template: '',
  standalone: true,
})
class DataTableStub<T> {
  @Input() columns!: unknown;
  @Input() data!: unknown;
  @Input() loading: boolean = false;
  @Input() error: any;
  @Output() rowClick = new EventEmitter<T>();
}

describe('ProjectsTable (host)', () => {
  let fixture: ComponentFixture<HostProjectsTableTest>;

  let colsMock: {
    visible: () => Array<{ key: string; header: string }>;
    all: Array<{ key: string; header: string }>;
    selectedKeys: () => string[];
    setSelected: ReturnType<typeof vi.fn>;
  };
  let stateMock: {
    projects: () => ProjectDTO[];
    loadingList: () => boolean;
    listError: () => string | null;
  };
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const dummyAll = [
    { key: 'code', header: 'Código' },
    { key: 'name', header: 'Nombre' },
  ];
  const dummyVisible = [
    { key: 'code', header: 'Código' },
  ];
  const dummySelectedKeys = ['code'];

  beforeEach(async () => {
    colsMock = {
      visible: () => dummyVisible,
      all: dummyAll,
      selectedKeys: () => dummySelectedKeys,
      setSelected: vi.fn(),
    };
    stateMock = {
      projects: () => [{ id: 1, code: 'A', name: 'Prj A' }] as ProjectDTO[],
      loadingList: () => false,
      listError: () => null,
    };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HostProjectsTableTest, DataTableStub],
      providers: [
        { provide: ProjectsColumnsStore, useValue: colsMock },
        { provide: ProjectState, useValue: stateMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostProjectsTableTest);
    fixture.detectChanges();
  });

  it('should render DataTable stub and pass correct inputs', () => {
    const ptDebug = fixture.debugElement.query(By.directive(ProjectsTable));
    expect(ptDebug).toBeTruthy();
    const dtDebug = ptDebug.query(By.directive(DataTableStub));
    expect(dtDebug).toBeTruthy();
    const dt = dtDebug.componentInstance as DataTableStub<ProjectDTO>;

    expect(dt.columns).toEqual(dummyVisible);
    expect(dt.data).toEqual(stateMock.projects());
    expect(dt.loading).toBe(false);
    expect(dt.error).toBeNull();
  });

  it('when rowClick is emitted, should navigate to detail', () => {
    const ptDebug = fixture.debugElement.query(By.directive(ProjectsTable));
    const dtDebug = ptDebug.query(By.directive(DataTableStub));
    const dt = dtDebug.componentInstance as DataTableStub<ProjectDTO>;

    dt.rowClick.emit({ id: 7 } as ProjectDTO);
    expect(routerMock.navigate).toHaveBeenCalledWith(['projects/7']);
  });

  it('toggleKey should call setSelected with updated keys', () => {
    const pt = fixture.debugElement.query(By.directive(ProjectsTable)).componentInstance as ProjectsTable;
    pt.toggleKey('name' as Key);
    expect(colsMock.setSelected).toHaveBeenCalledWith([...dummySelectedKeys, 'name']);
  });
});
