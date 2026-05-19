import { Pipe, PipeTransform } from '@angular/core';
import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';

/**
 * Convert a string to RGB color
 */
@Pipe({
  name: 'flStringToRgb',
  standalone: false,
})
export class FlStringToRgbPipe implements PipeTransform {
  transform(value: any, defaultColor: string = 'transparent'): string {
    if (value == null) {
      return defaultColor;
    }

    if (typeof value !== 'string') {
      value = value.toString();
    }
    return FlColorHelper.stringToRGBColor(value);
  }
}
