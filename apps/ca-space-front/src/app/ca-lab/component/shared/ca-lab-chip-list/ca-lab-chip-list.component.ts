import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

/**
 * A wrapping row of pill chips with a leading glyph, plus a "+N" overflow chip when the
 * list is longer than `max`. Used in the dashboard accordion headers to preview folders.
 */
@Component({
  selector: 'ca-lab-chip-list',
  templateUrl: './ca-lab-chip-list.component.html',
  styleUrls: ['./ca-lab-chip-list.component.scss'],
  imports: [MatIcon],
})
export class CaLabChipListComponent {
  labels = input.required<string[]>();
  /** Material icon rendered as the leading glyph of each chip. */
  icon = input<string>();
  /** Colour class applied to the leading glyph ('primary' | 'accent'). */
  iconColor = input<'primary' | 'accent'>('accent');
  /** Maximum number of chips before collapsing the rest into a "+N" chip. */
  max = input<number>(4);

  visibleLabels = computed(() => this.labels().slice(0, this.max()));
  overflowCount = computed(() => Math.max(0, this.labels().length - this.max()));
}
