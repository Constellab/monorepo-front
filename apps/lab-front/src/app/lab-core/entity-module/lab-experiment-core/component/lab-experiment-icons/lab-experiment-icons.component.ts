import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabExperiment } from '../../../../model/entities/lab-experiment.entity';

/**
 * small component to display icons for an experiment
 * Validated, Archived, Creation type
 */
@Component({
  selector: 'lab-experiment-icons',
  templateUrl: './lab-experiment-icons.component.html',
  styleUrl: './lab-experiment-icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabExperimentIconsComponent {

  @Input({ required: true }) experiment: LabExperiment;

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
