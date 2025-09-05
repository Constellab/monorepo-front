import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

@Component({
  selector: 'co-item-type-icon',
  templateUrl: './co-item-type-icon.component.html',
  styleUrls: ['./co-item-type-icon.component.scss'],
  imports: [FlIconModule, MatIconModule, NgClass],
})
export class CoItemTypeIconComponent {
  type = input.required<'app' | 'brick' | 'agent' | 'story'>();

  size = input<'small' | 'medium' | 'big'>('medium');

  color = computed(() => {
    switch (this.type()?.toLowerCase()) {
      case 'app':
        return 'accent';
      case 'brick':
        return 'warn';
      case 'agent':
        return 'primary';
      case 'story':
        return 'warn';
      default:
        return 'primary';
    }
  });

  colorClass = computed(() => {
    switch (this.color()) {
      case 'primary':
        return 'co-type-icon-primary';
      case 'accent':
        return 'co-type-icon-accent';
      case 'warn':
        return 'co-type-icon-warn';
      default:
        return '';
    }
  });

  sizeClass = computed(() => {
    switch (this.size()) {
      case 'small':
        return 'co-type-icon-small';
      case 'medium':
        return 'co-type-icon-medium';
      case 'big':
        return 'co-type-icon-big';
      default:
        return '';
    }
  });
}
