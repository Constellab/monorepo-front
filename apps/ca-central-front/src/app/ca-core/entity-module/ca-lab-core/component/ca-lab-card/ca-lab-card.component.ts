import { Component, Input } from '@angular/core';
import { CaLab } from '../../../../model/entities/lab/ca-lab.class';

/**
 * Card to display a {@link CaLab}
 */
@Component({
  selector: 'ca-lab-card',
  templateUrl: './ca-lab-card.component.html',
  styleUrls: ['./ca-lab-card.component.scss'],
})
export class CaLabCardComponent {
  @Input() lab: CaLab;

  // prevent ripple effect when used on card
  stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }

  get iconBackground(): string {
    return this.lab.isRunning() ? 'g-primary-background' : 'g-warn-background';
  }

  get statusTooltip(): string {
    return this.lab.currentStatus.status.name;
  }
}
