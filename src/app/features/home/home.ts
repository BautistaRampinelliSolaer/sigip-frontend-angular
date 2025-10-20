import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeSwitcher } from '@app/shared/ui';
import { Header } from '@app/shared/ui/molecules/header/header';
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatButton } from '@angular/material/button';
import { Skeleton } from "@app/shared/ui/molecules/skeleton/skeleton";
import { EmptyState } from "@app/shared/ui/molecules/empty-state/empty-state";
import { ErrorState } from "@app/shared/ui/molecules/error-state/error-state";

@Component({
  selector: 'app-home',
  imports: [Header, ThemeSwitcher, MatButton, MatSlideToggle, MatInputModule, Skeleton, EmptyState, ErrorState],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  load() {
    console.log('load');
  }
}
