import { Pipe, PipeTransform } from '@angular/core';
import { ChChartLabelFormatter } from '../model/ch-chart-label-formatter.class';

/**
 * Pipe to call a formatter on a value
 */
@Pipe({
  name: 'chChartValueFormatter',
})
export class ChChartValueFormatterPipe implements PipeTransform {
  transform(value: number, formatter: ChChartLabelFormatter, text: 'short' | 'long' = 'short'): string {
    if (text === 'short') {
      return formatter.formatShort(value);
    }
    return formatter.formatLong(value);
  }
}
