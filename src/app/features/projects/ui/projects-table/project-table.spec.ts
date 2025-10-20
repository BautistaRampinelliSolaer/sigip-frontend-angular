// projects-table-host.spec.ts
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ProjectsTable } from './projects-table';
import { ProjectsColumnsStore } from '../projects-columns.store';
import { ProjectState } from '../../state/project-state';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ProjectDTO } from '@app/domain/models';
import { Key } from '../projects-columns.store';

@Component({
  standalone: true,
  template: `<app-projects-table></app-projects-table>`,
  imports: [ProjectsTable],
})
class HostProjectsTableTest {}

// Stub for DataTable component
import { EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'data-table',
  template: '',
  standalone: true,
})
class DataTableStub {
  @Input() columns: any;
  @Input() data: any;
  @Input()
    loading: boolean = false;
  @Input() error: any;
  @Output() rowClick = new EventEmitter<any>();
}

describe('ProjectsTable (host)', () => {
  let fixture: ComponentFixture<HostProjectsTableTest>;

  let colsMock: any;
  let stateMock: any;
  let routerMock: any;

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
      projects: () => [{ id: 1, code: 'A', name: 'Prj A' }],
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

  it('DataTable stub debe estar presente y recibir inputs correctos', () => {
    // Encuentra el componente projects-table dentro del host
    const ptDebug = fixture.debugElement.query(By.directive(ProjectsTable));
    expect(ptDebug).toBeTruthy();
    // Ahora dentro de ese subtree encontrar DataTableStub
    const dtDebug = ptDebug.query(By.directive(DataTableStub));
    expect(dtDebug).toBeTruthy();
    const dt = dtDebug.componentInstance as DataTableStub;

    // Verificá los inputs del stub
    expect(dt.columns).toEqual(dummyVisible);
    expect(dt.data).toEqual(stateMock.projects());
    expect(dt.loading).toBe(false);
    expect(dt.error).toBeNull();
  });

  it('cuando rowClick emite del DataTable stub, ProjectsTable openDetail debe navegar', () => {
    const ptDebug = fixture.debugElement.query(By.directive(ProjectsTable));
    const dtDebug = ptDebug.query(By.directive(DataTableStub));
    expect(dtDebug).toBeTruthy();
    const dt = dtDebug.componentInstance as DataTableStub;

    dt.rowClick.emit({ id: 7 });
    expect(routerMock.navigate).toHaveBeenCalledWith([`projects/7`]);
  });

  it('toggleKey debe llamar setSelected del store', () => {
    const pt = fixture.debugElement.query(By.directive(ProjectsTable)).componentInstance as ProjectsTable;
    pt.toggleKey('name' as Key);
    expect(colsMock.setSelected).toHaveBeenCalledWith([...dummySelectedKeys, 'name']);
  });
});
