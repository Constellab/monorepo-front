import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * small component to display icons for a scenario
 * Validated, Archived, Creation type
 */
@Component({
  selector: 'lab-scenario-icons',
  templateUrl: './lab-scenario-icons.component.html',
  styleUrl: './lab-scenario-icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, FlIconModule, MatTooltip, NgClass, TranslatePipe],
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
