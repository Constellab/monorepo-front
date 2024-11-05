import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';

/**
 * small component to display icons for an scenario
 * Validated, Archived, Creation type
 */
@Component({
  selector: 'lab-scenario-icons',
  templateUrl: './lab-scenario-icons.component.html',
  styleUrl: './lab-scenario-icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabScenarioIconsComponent {
  @Input({ required: true }) scenario: LabScenario;

  @Input() size: 'normal' | 'big' = 'normal';

  get iconSizeClass(): string {
    switch (this.size) {
      case 'normal':
        return 'g-icon-normal';
      case 'big':
        return 'g-icon-big';
    }
  }
}
