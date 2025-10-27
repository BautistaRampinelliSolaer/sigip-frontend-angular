import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { MatToolbar } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { ThemeSwitcher } from "../../molecules/theme-switcher/theme-switcher";

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatButtonModule, MatIcon, ThemeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly _auth = inject(AuthService);

  protected readonly isLogged = this._auth.isLogged;
  protected readonly user = this._auth.user;
  protected readonly appName = signal('SIGIP');

  protected logout(): void {
    this._auth.logout();
  }
}
