import {Component, Input} from '@angular/core';
import {ClDateFormat, ClDateInput} from '@monorepo/core-lib';
import {TooltipPosition} from '@angular/material/tooltip';

/**
 * Component to show a from with form now format and a tooltip with the exact date
 */
@Component({
  selector: 'fl-from-now',
  templateUrl: './fl-from-now.component.html',
  styleUrls: ['./fl-from-now.component.scss']
})
export class FlFromNowComponent {

  @Input() date: ClDateInput;

  @Input() prefix: string;

  @Input() tooltipFormat: string = ClDateFormat.DATE_TIME;

  @Input() tooltipPosition: TooltipPosition = 'above';

  @Input() disabledTooltip: boolean = false;

}
