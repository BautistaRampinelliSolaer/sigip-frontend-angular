import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-gp-input',
  imports: [ReactiveFormsModule],
  templateUrl: './gp-input.html',
  styleUrl: './gp-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpInput {
  label = input<string>('');
  control = input.required<any>();
  type = input<string>('text');
  placeholder = input<string>('');
}
