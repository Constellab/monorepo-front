import { Pipe, PipeTransform } from '@angular/core';
import { ClDateFormat, ClDateHelper, ClDateInput } from '@monorepo/core-lib';

// create a type where the possible values are the keys of the enum
// this is to simplify the use of the pipe in the template
export type ClDateFormatKey = keyof typeof ClDateFormat | string;

/**
 * Simple date pipe that supports luxon dates
 * Supports : https://moment.github.io/luxon/#/formatting?id=table-of-tokens
 * Support preset : https://moment.github.io/luxon/#/formatting?id=presets
 */
@Pipe({
    name: 'flDate',
    standalone: false
})
export class FlDatePipe implements PipeTransform {
  transform(value: ClDateInput, format: ClDateFormatKey = 'DATE'): string {
    if (value == null) {
      return '';
    }

    const date = ClDateHelper.getDate(value);
    // check if format is a key of the enum
    const dateFormat: ClDateFormat | null = ClDateFormat[format as keyof typeof ClDateFormat];

    if (dateFormat) {
      return date.toFormat(dateFormat);
    }

    return date.toFormat(format);
  }
}
