import { Pipe, PipeTransform } from '@angular/core';

/**
 * Return the flag image path based on country short name (fr, en, es, ...)
 */
@Pipe({
  name: 'caCountryFlag',
})
export class CaCountryFlagPipe implements PipeTransform {
  transform(countryShortName: string): string {
    if (!countryShortName) return null;

    return `assets/icons/country-svg/${countryShortName}.svg`;
  }
}
