import { Component, Input } from '@angular/core';

import { ChChartLabelFormatter } from '../../../model/ch-chart-label-formatter.class';

/**
 * Simple component to show a value of a chart using a formatter. It shows the long value in a tooltip.
 */
@Component({
  selector: 'ch-chart-value',
  templateUrl: './ch-chart-value.component.html',
  styleUrls: ['./ch-chart-value.component.scss'],
  standalone: false,
})
export class ChChartValueComponent {
  @Input() name: string;

  @Input() value: number;

  @Input() formatter: ChChartLabelFormatter;
}
