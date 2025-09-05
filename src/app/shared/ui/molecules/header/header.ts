import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  title = input<string>('SIGIP');
}
