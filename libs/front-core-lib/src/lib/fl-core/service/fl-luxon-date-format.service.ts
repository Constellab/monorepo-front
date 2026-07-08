import { MatDateFormats } from '@angular/material/core';
import { ClDateFormat } from '@monorepo/core-lib';

/**
 * Default format to use to the MatDataPicker
 */
export const FL_LUXON_DATE_FORMAT: MatDateFormats = {
  parse: {
    // input supported by the date picker (like 04/09/1986 in local format)
    dateInput: 'd/L/y',
    timeInput: 'HH:mm',
  },
  display: {
    // displayed input value
    dateInput: ClDateFormat.DATE,
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'DDD',
    monthYearA11yLabel: 'MMMM yyyy',
    timeInput: 'HH:mm',
    timeOptionLabel: 'HH:mm',
  },
};
