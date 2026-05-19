import { Pipe, PipeTransform } from '@angular/core';
import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';

/**
 * Get the contrast color (black or white) for a given hex color
 */
@Pipe({
  name: 'flContrastColor',
  standalone: false,
})
export class FlContrastColorPipe implements PipeTransform {
  transform(value: string): string {
    if (value == null) {
      return 'black';
    }
    return FlColorHelper.getContrastColor(value);
  }
}
