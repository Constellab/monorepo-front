import {Pipe, PipeTransform} from '@angular/core';
import {ChChartScaleI} from '../model/scale/ch-chart-scale.class';

/**
 * Simple pipe to apply a scale on a value
 */
@Pipe({
  name: 'chChartScale'
})
export class ChChartScalePipe implements PipeTransform {

  transform(value: any, scale: ChChartScaleI): any {
    return scale.scale(value);
  }

}
