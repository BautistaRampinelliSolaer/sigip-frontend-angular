import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-field',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss'
})
export class SearchField {
  placeholder = input('Buscar...');
  control = input.required<FormControl<string>>();
}
