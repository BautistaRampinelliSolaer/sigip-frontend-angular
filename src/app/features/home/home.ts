import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from '@app/shared/ui/molecules/header/header';

@Component({
  selector: 'app-home',
  imports: [ Header ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
