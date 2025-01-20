import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FlStatus } from '../../model/fl-status.class';
import { Observable, of } from 'rxjs';
import { TooltipPosition } from '@angular/material/tooltip';

export type FlStatusChipMode = 'iconText' | 'iconOnly' | 'textOnly';

/**
 * Simple component to display a status on a chip with color
 */
@Component({
    selector: 'fl-status-chip',
    templateUrl: './fl-status-chip.component.html',
    styleUrls: ['./fl-status-chip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FlStatusChipComponent {
  @Input() set status(status: FlStatus | Observable<FlStatus>) {
    if (status instanceof Observable) {
      this.status$ = status;
    } else {
      this.status$ = of(status);
    }
  }

  /**
   * Display or not the icon or text
   */
  @Input() mode: FlStatusChipMode = 'iconText';

  @Input() tooltipPosition: TooltipPosition = 'below';

  /**
   * If true the tooltip is disabled
   * By default tooltip is disabled in iconText and textOnly mode and enable in iconOnly mode
   */
  @Input() tooltipDisabled: boolean;

  @Input() size: 'normal' | 'small' = 'normal';

  status$: Observable<FlStatus>;

  get showIcon(): boolean {
    return this.mode === 'iconText' || this.mode === 'iconOnly';
  }

  get showText(): boolean {
    return this.mode === 'iconText' || this.mode === 'textOnly';
  }

  get iconClass(): string {
    return this.size === 'normal' ? 'g-icon-small' : 'g-icon-tiny';
  }

  get loaderSize(): number {
    return this.size === 'normal' ? 24 : 16;
  }

  // get tooltip value, take input value if provided, otherwise disable if text is shown
  get tooltipDisabledBool(): boolean {
    return this.tooltipDisabled != null ? this.tooltipDisabled : this.showText;
  }
}
