import { Component, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gp-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './gp-button.html',
  styleUrl: './gp-button.scss'
})
export class GpButton {
  color = input<'primary' | 'accent' | 'warn' | 'undefined'>('primary');
  disabled = input(false);
  icon = input<string>('');
}