import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { MatCardModule } from "@angular/material/card";
import { CdkTableModule } from "@angular/cdk/table";
import {MatChipsModule} from '@angular/material/chips';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, CdkTableModule, MatButton, MatChipsModule],
})
export class ProfilePage {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.user;
  protected readonly isLogged = this.auth.isLogged;

  protected readonly fullName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return [u.name, u.lastname].filter(Boolean).join(' ');
  });

  protected readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '';
    const fi = u.name?.[0] ?? '';
    const li = u.lastname?.[0] ?? '';
    return (fi + li).toUpperCase();
  });

  protected readonly roleLabel = computed(() => (this.user()?.role));

  refresh() {
    const u = this.user();
    if(!u) return;

  }

  logout() {
    this.auth.logout();
  }
}
