import { Component, computed, signal } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly currentYear = computed(() => new Date().getFullYear());
  protected readonly appName = signal('SIGIP');
  protected readonly links = signal([
    { label: 'Ayuda', href: '/help' },
    { label: 'Contacto', href: '/contact' },
    { label: 'Términos', href: '/terms' },
  ]);
}
