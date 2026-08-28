import { Pipe, PipeTransform } from '@angular/core';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';

/**
 * Pipe to transform a number to a byte value like 55MB
 */
@Pipe({
  name: 'flByteText',
  standalone: false,
})
export class FlByteTextPipe implements PipeTransform {
  transform(value: number): string | null {
    if (value == null) return null;
    return FlFileHelper.getFileSizeText(value);
  }
}
