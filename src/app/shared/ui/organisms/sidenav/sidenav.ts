import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidenav {
  userName = input<string>('Invitado');
  logout = output<void>();
}
