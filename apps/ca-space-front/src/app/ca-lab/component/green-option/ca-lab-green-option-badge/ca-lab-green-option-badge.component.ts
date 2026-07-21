import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaLabGreenOption,
  CaLabGreenOptionStopAfterInactivityValue,
  CaLabGreenOptionStopAfterTimeValue,
  CaLabGreenOptionType,
} from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';

interface GreenBadgeContent {
  icon: string;
  /** Translation key for the compact label. */
  labelKey: string;
  /** Optional interpolation params for the label. */
  params?: Record<string, string | number>;
}

/**
 * Compact badge summarising a single green-computing rule with an icon and a short
 * human-readable label (e.g. "Stop at 19:00"). Used to preview rules in the dashboard
 * accordion header.
 */
@Component({
  selector: 'ca-lab-green-option-badge',
  templateUrl: './ca-lab-green-option-badge.component.html',
  styleUrls: ['./ca-lab-green-option-badge.component.scss'],
  imports: [MatIcon, TranslatePipe],
})
export class CaLabGreenOptionBadgeComponent {
  greenOption = input.required<CaLabGreenOption>();

  content = computed<GreenBadgeContent>(() => this.buildContent(this.greenOption()));

  private buildContent(option: CaLabGreenOption): GreenBadgeContent {
    switch (option.type) {
      case CaLabGreenOptionType.STOP_AFTER_TIME: {
        const value = option.value as CaLabGreenOptionStopAfterTimeValue;
        const time = `${this.pad(value?.hours)}:${this.pad(value?.minutes)}`;
        return { icon: 'schedule', labelKey: 'lab_green_badge_stop_at', params: { time } };
      }
      case CaLabGreenOptionType.STOP_AFTER_INACTIVITY_TIME: {
        const value = option.value as CaLabGreenOptionStopAfterInactivityValue;
        return {
          icon: 'timer_off',
          labelKey: 'lab_green_badge_stop_after_inactivity',
          params: { minutes: value?.inactivityDuration },
        };
      }
      case CaLabGreenOptionType.STOP_AFTER_SCENARIO:
        return { icon: 'task_alt', labelKey: 'lab_green_badge_stop_after_scenario' };
      case CaLabGreenOptionType.STOP_AFTER_BACKUP:
        return { icon: 'backup', labelKey: 'lab_green_badge_stop_after_backup' };
      default:
        return { icon: 'schedule', labelKey: 'lab_green_option_' + option.type };
    }
  }

  private pad(value: number | undefined): string {
    return (value ?? 0).toString().padStart(2, '0');
  }
}
