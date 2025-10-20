import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  success(msg: string) { this.message.set(msg); setTimeout(() => this.clear(), 2500); }
  error(msg: string)   { this.message.set(msg); setTimeout(() => this.clear(), 3500); }
  clear() { this.message.set(null); }
}
