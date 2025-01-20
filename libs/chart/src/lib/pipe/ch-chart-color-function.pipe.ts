import { Pipe, PipeTransform } from '@angular/core';
import { ChChartColorFunction } from '../model/scale/ch-chart-scale-color.class';

/**
 * Pipe to execute a ChChartColorFunction
 */
@Pipe({
    name: 'chChartColorFunction',
    standalone: false
})
export class ChChartColorFunctionPipe implements PipeTransform {
  transform(value: any, colorFunction: ChChartColorFunction): string {
    return colorFunction(value);
  }
}
