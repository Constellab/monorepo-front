import { Pipe, PipeTransform, inject } from '@angular/core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

/**
 * Simple pipe to display an error message generally used in forms.
 *
 * The output string is :  The field [value] is mandatory
 */
@Pipe({
  name: 'flErrorRequired',
  standalone: false,
})
export class FlErrorRequiredPipe implements PipeTransform {
  private translateService = inject(FlTranslateService);

  /**
   *
   * @param value field name
   * @param translateValue if true the value is translated
   */
  transform(value: any, translateValue: boolean = true): any {
    if (translateValue) {
      value = this.translateService.translate(value);
    }

    return this.translateService.translate('flCorePipe.error_required', { param: { field: value } });
  }
}
