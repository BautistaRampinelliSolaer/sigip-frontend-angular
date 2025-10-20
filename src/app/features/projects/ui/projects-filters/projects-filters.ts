import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BrowserStorage } from '@app/core/storage/storage';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';

export type Filters = {
  q: string;
  state: string;
  responsibleId: number | null;
};

@Component({
  selector: 'projects-filters',
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, ],
  templateUrl: './projects-filters.html',
  styleUrls: ['./projects-filters.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsFilters {
  private readonly fb = inject(FormBuilder);
  private readonly storage = inject(BrowserStorage);
  private readonly STORAGE_KEY = 'projects.filters';
  private sub?: Subscription;

  apply = output<Filters>();

  form = this.fb.nonNullable.group({
    q: [''],
    state: [''],
    responsibleId: <number | null>null,
  });

  ngOnInit() {
    const raw = this.storage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        (this.form.patchValue(JSON.parse(raw) as Filters), { emitEvent: false });
      } catch {
        /* ignore */
      }
    }

    this.sub = this.form.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((v) => {
        this.storage.setItem(this.STORAGE_KEY, JSON.stringify(v));
        this.apply.emit(v as Filters);
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
