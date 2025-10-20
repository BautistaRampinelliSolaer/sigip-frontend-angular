import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ProjectsPage } from './projects-page';
import { ProjectState } from '../../state/project-state';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'projects-filters',
  standalone: true,
  template: '',
})
class ProjectsFiltersStub {
  @Output() apply = new EventEmitter<any>();
}

@Component({
  selector: 'app-projects-table',
  standalone: true,
  template: '',
})
class ProjectsTableStub { }

describe('ProjectsPage', () => {
  let mockState: any;

  beforeEach(async () => {
    mockState = {
      loadList: vi.fn().mockResolvedValue(undefined),
      setFilters: vi.fn(),
      projects: () => [],       
      loadingList: () => false, 
      listError: () => null, 
    };

    await TestBed.configureTestingModule({
      imports: [ProjectsPage, ProjectsFiltersStub, ProjectsTableStub],
      providers: [
        { provide: ProjectState, useValue: mockState },
      ],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(ProjectsPage);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('ngOnInit llama loadList en el store', () => {
    const fixture = TestBed.createComponent(ProjectsPage);
    fixture.detectChanges();
    expect(mockState.loadList).toHaveBeenCalled();
  });

  it('onApplyFilters llama setFilters con el valor recibido', () => {
    const fixture = TestBed.createComponent(ProjectsPage);
    const component = fixture.componentInstance;

    const filtro = { q: 'abc', state: 'Open', responsibleId: 5 };
    component.onApplyFilters(filtro);
    expect(mockState.setFilters).toHaveBeenCalledWith(filtro);
  });

  it('renderiza el título "Proyectos"', () => {
    const fixture = TestBed.createComponent(ProjectsPage);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Proyectos');
  });
});
