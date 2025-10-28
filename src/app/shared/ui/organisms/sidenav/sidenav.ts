import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';

type NavItem = { label: string; icon: string; link: string };

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    MatNavList,
    MatListItem,
    MatIcon,
    MatAnchor,
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  readonly userName = input<string>('Invitado');
  readonly userRole = input<string>('Usuario');
  readonly collapsed = input<boolean>(false);
  readonly imgSrc = input<string>('/assets/logo.svg');

  logout = output<void>();

  protected readonly appName = 'SIGIP';

  protected readonly items = signal<NavItem[]>([
    { label: 'Home', icon: 'home', link: '/' },
    { label: 'Proyectos', icon: 'work', link: '/projects' },
    { label: 'Horas', icon: 'timer', link: '/hours' },
    { label: 'Clientes', icon: 'groups', link: '/clients' },
    { label: 'Mi Perfil', icon: 'person', link: '/profile' },
  ]);

  protected readonly initials = computed(() => {
    const n = (this.userName() ?? '').trim();
    if (!n) return '👤';
    const parts = n.split(/\s+/);
    return parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  });

  protected onLogout(): void {
    this.logout.emit();
  }
}
