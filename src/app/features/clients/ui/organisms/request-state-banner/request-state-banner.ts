import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-request-state-banner',
  imports: [CommonModule, MatIconModule],
  templateUrl: './request-state-banner.html',
  styleUrls: ['./request-state-banner.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStateBanner {
  readonly state = input<'empty' | 'error' | 'info'>('info');
  readonly message = input<string>('');
}
