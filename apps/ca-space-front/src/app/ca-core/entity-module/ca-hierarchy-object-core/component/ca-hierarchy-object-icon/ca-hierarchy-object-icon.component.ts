import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { TdTechnicalDocModule, TdTypeStyle } from '@monorepo/technical-doc';

@Component({
  selector: 'ca-hierarchy-object-icon',
  templateUrl: './ca-hierarchy-object-icon.component.html',
  styleUrl: './ca-hierarchy-object-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TdTechnicalDocModule],
})
export class CaHierarchyObjectIconComponent {
  style = input.required<TdTypeStyle>();

  size = input<'medium' | 'small' | 'big'>('medium');

  // (this.size() === 'small' ? 18 : 24))
  iconSize: Signal<number> = computed(() => {
    switch (this.size()) {
      case 'small':
        return 18;
      case 'big':
        return 46;
      case 'medium':
      default:
        return 24;
    }
  });
}
