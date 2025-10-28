import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectDTO } from '@app/domain/models';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// type EditableKeys =
//   | 'name'
//   | 'state'
//   | 'description'
//   | 'keyword'
//   | 'image'
//   | 'folderPath'
//   | 'responsible'
//   | 'reviewer'
//   | 'corrector'
//   | 'parentProject';

@Component({
  selector: 'project-form',
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './project-form.html',
  styleUrls: ['./project-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  project = input<ProjectDTO | null>(null);

  submit = output<Partial<ProjectDTO>>();
  cancel = output<void>();

  form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    state: [''],
    responsibleId: <number | null>null,
    description: [''],
  });

  ngOnInit() {
    const p = this.project();
    if (p) {
      this.form.patchValue({
        code: p.code,
        name: p.name,
        state: p.state ?? '',
        responsibleId: p.responsible?.id ?? null,
        description: p.description ?? '',
      });
    }
  }

  onSubmit() {
    if (this.form.valid) this.submit.emit(this.form.getRawValue());
    else this.form.markAllAsTouched();
  }

  // project = input.required<ProjectDTO>();
  // editMode = input(false);
  // save = output<Partial<ProjectDTO>>();
  // cancel = output<void>();

  // private fb = new FormBuilder().nonNullable;

  // readonly editable = new Set<EditableKeys>([
  //   'name',
  //   'state',
  //   'description',
  //   'keyword',
  //   'image',
  //   'folderPath',
  //   'responsible',
  //   'reviewer',
  //   'corrector',
  //   'parentProject',
  // ]);

  // readonly form = this.fb.group({
  //   // readonly
  //   code: [{ value: '', disabled: true }],
  //   company: [{ value: '', disabled: true }],
  //   plantCompany: [{ value: '', disabled: true }],
  //   creationDate: [{ value: '', disabled: true }],
  //   type: [{ value: '', disabled: true }],
  //   // editable
  //   name: ['', [Validators.required, Validators.minLength(3)]],
  //   state: [''],
  //   description: [''],
  //   keyword: [''],
  //   image: [''],
  //   folderPath: [''],
  //   responsibleName: [''],
  //   reviewerName: [''],
  //   correctorName: [''],
  //   parentProjectName: [''],
  // });

  // readonly dirty = signal(false);
  // readonly canSave = computed(() => this.editMode() && this.form.valid && this.dirty());

  // ngOnInit() {
  //   this.form.valueChanges.subscribe(() => this.dirty.set(true));
  // }

  // ngOnChanges() {
  //   const p = this.project();
  //   if (!p) return;

  //   this.form.reset(
  //     {
  //       code: p.code,
  //       company: p.company?.name ?? '',
  //       plantCompany: p.plantCompany?.name ?? '',
  //       creationDate: p.creationDate,
  //       type: p.type,
  //       name: p.name,
  //       state: p.state ?? '',
  //       description: p.description ?? '',
  //       keyword: p.keyword ?? '',
  //       image: p.image ?? '',
  //       folderPath: p.folderPath ?? '',
  //       responsibleName: p.responsible?.name ?? '',
  //       reviewerName: p.reviewer?.name ?? '',
  //       correctorName: p.corrector?.name ?? '',
  //       parentProjectName: p.parentProject?.name ?? '',
  //     },
  //     { emitEvent: false },
  //   );

  //   this.applyEditability(this.editMode());
  //   this.dirty.set(false);
  // }

  // applyEditability(isEditing: boolean) {
  //   const controls = this.form.controls;
  //   const enableIf = (key: keyof typeof controls, can: boolean) =>
  //     can
  //       ? controls[key].enable({ emitEvent: false })
  //       : controls[key].disable({ emitEvent: false });

  //   // readonly siempre deshabilitados
  //   enableIf('code', false);
  //   enableIf('company', false);
  //   enableIf('plantCompany', false);
  //   enableIf('creationDate', false);
  //   enableIf('type', false);

  //   // editable según modo
  //   const can = (k: EditableKeys) => isEditing && this.editable.has(k);

  //   enableIf('name', can('name'));
  //   enableIf('state', can('state'));
  //   enableIf('description', can('description'));
  //   enableIf('keyword', can('keyword'));
  //   enableIf('image', can('image'));
  //   enableIf('folderPath', can('folderPath'));
  //   enableIf('responsibleName', can('responsible'));
  //   enableIf('reviewerName', can('reviewer'));
  //   enableIf('correctorName', can('corrector'));
  //   enableIf('parentProjectName', can('parentProject'));
  // }

  // onToggleEdit(v: boolean) {
  //   this.applyEditability(v);
  //   if (!v) this.ngOnChanges();
  // }

  // submit() {
  //   if (!this.canSave()) return;
  //   const raw = this.form.getRawValue();
  //   const dto: Partial<ProjectDTO> = {
  //     name: raw.name,
  //     state: raw.state || undefined,
  //     description: raw.description || '',
  //     keyword: raw.keyword || '',
  //     image: raw.image || '',
  //     folderPath: raw.folderPath || '',
  //     responsible: raw.responsibleName ? ({ id: -1, name: raw.responsibleName } as any) : undefined,
  //     reviewer: raw.reviewerName ? ({ id: -1, name: raw.reviewerName } as any) : undefined,
  //     corrector: raw.correctorName ? ({ id: -1, name: raw.correctorName } as any) : undefined,
  //     parentProject: raw.parentProjectName
  //       ? ({ id: -1, name: raw.parentProjectName } as any)
  //       : undefined,
  //   };
  //   this.save.emit(dto);
  //   this.dirty.set(false);
  // }

  // onCancel() {
  //   this.cancel.emit();
  // }
}
