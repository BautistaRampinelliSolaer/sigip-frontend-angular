import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ProjectsFilters, Filters } from './projects-filters';
import { BrowserStorage } from '@app/core/storage/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

class StorageMock {
  private map = new Map<string, string>();
  getItem(key: string) { return this.map.get(key) ?? null; }
  setItem(key: string, value: string) { this.map.set(key, value); }
}

describe('ProjectsFilters', () => {
  let fixture: ComponentFixture<ProjectsFilters>;
  let component: ProjectsFilters;
  let storageMock: StorageMock;

  beforeEach(() => {
    storageMock = new StorageMock();

    TestBed.configureTestingModule({
      imports: [ProjectsFilters, ReactiveFormsModule, MatInputModule, MatSelectModule],
      providers: [
        { provide: BrowserStorage, useValue: storageMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsFilters);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debe patchar valores del storage al init sin emitir', () => {
    const stored: Filters = { q: 'xyz', state: 'IN_PROGRESS', responsibleId: 42 };
    storageMock.setItem('projects.filters', JSON.stringify(stored));

    fixture.detectChanges(); // inicializa el componente (ngOnInit)
    // No emitir inmediatamente al patch
    let emitted: Filters | undefined;
    component.apply.subscribe(v => emitted = v);

    // no emitió nada al patch inicial
    expect(emitted).toBeUndefined();

    // los valores del form coinciden
    expect(component.form.value).toEqual(stored);
  });

  it('debe emitir apply con el valor luego del debounce', fakeAsync(() => {
    fixture.detectChanges(); // arranca
    let emitted: Filters | undefined;
    component.apply.subscribe(v => emitted = v);

    // cambias un control
    component.form.controls.q.setValue('abc');
    component.form.controls.state.setValue('OPEN');
    component.form.controls.responsibleId.setValue(7);

    // sin tiempo no emite
    tick(200);
    expect(emitted).toBeUndefined();

    // después del debounce de 250ms
    tick(300);
    expect(emitted).toEqual({ q: 'abc', state: 'OPEN', responsibleId: 7 });
    // y también debe haberse guardado al storage
    const raw = storageMock.getItem('projects.filters');
    expect(raw).toBe(JSON.stringify({ q: 'abc', state: 'OPEN', responsibleId: 7 }));
  }));

  it('debe desuscribirse en ngOnDestroy', () => {
    fixture.detectChanges();
    // spy al unsub
    const sub = component['sub'];
    vi.spyOn(sub!, 'unsubscribe');

    component.ngOnDestroy();
    expect(sub?.unsubscribe).toHaveBeenCalled();
  });
});
