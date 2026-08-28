import { inject, Pipe, PipeTransform } from '@angular/core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

@Pipe({
  name: 'flYesNo',
  standalone: false,
})
export class FlYesNoPipe implements PipeTransform {
  private translateService = inject(FlTranslateService);

  /**
   * Transform pipe method
   * @param value boolean value
   * @param lowercase if true lowercase the string
   */
  transform(value: boolean, lowercase: boolean = false): string | null {
    let stringValue: string;
    if (value == null) {
      return null;
    } else if (value) {
      stringValue = this.translateService.translate('flCorePipe.yes');
    } else {
      stringValue = this.translateService.translate('flCorePipe.no');
    }

    if (lowercase) {
      stringValue = stringValue.toLowerCase();
    }

    return stringValue;
  }
}
