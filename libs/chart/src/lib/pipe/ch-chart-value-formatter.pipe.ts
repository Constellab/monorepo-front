import { Pipe, PipeTransform } from '@angular/core';

import { ChChartLabelFormatter } from '../model/ch-chart-label-formatter.class';

/**
 * Pipe to call a formatter on a value
 */
@Pipe({
  name: 'chChartValueFormatter',
  standalone: false,
})
export class ChChartValueFormatterPipe implements PipeTransform {
  transform(
    value: number,
    formatter: ChChartLabelFormatter,
    text: 'short' | 'long' = 'short'
  ): string | null {
    if (text === 'short') {
      return formatter.formatShort(value);
    }
    return formatter.formatLong(value);
  }
}
