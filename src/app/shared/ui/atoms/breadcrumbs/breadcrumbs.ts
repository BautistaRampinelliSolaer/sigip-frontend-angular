import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sigip-breadcrumbs' },
  imports: [MatIconModule],
})
export class BreadcrumbsComponent {
  readonly trail = input.required<string[]>();
}
