import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiScenario } from '@monorepo/lab-lib/li-core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * small component to display icons for a scenario
 * Validated, Archived, Creation type
 */
@Component({
  selector: 'li-scenario-icons',
  templateUrl: './li-scenario-icons.component.html',
  styleUrl: './li-scenario-icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, FlIconModule, MatTooltip, NgClass, TranslatePipe],
})
export class LiScenarioIconsComponent {
  @Input({ required: true }) scenario: LiScenario;

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
