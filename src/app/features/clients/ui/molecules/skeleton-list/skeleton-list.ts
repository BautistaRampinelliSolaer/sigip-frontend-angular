import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-list',
  imports: [CommonModule],
  templateUrl: './skeleton-list.html',
  styleUrl: './skeleton-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonList {}
