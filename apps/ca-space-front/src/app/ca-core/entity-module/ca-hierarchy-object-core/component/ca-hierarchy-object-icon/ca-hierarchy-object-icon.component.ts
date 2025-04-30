import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

@Component({
  selector: 'ca-hierarchy-object-icon',
  templateUrl: './ca-hierarchy-object-icon.component.html',
  styleUrl: './ca-hierarchy-object-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TdTechnicalDocModule],
})
export class CaHierarchyObjectIconComponent {
  style = input.required<TdTypeStyle>();

  size = input<'medium' | 'small'>('medium');

  iconSize: Signal<number> = computed(() => (this.size() === 'small' ? 18 : 24));
}
