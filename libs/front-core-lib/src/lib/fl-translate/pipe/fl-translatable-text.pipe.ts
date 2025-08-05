import { inject,Pipe, PipeTransform } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';

import { FlTranslatableText } from '../model/fl-translate-param';
import { FlTranslateService } from '../service/fl-translate.service';

/**
 * Pipe to translate or not a {@link FlTranslatableText}
 */
@Pipe({
  name: 'flTranslatableText',
  standalone: false,
})
export class FlTranslatableTextPipe implements PipeTransform {
  private translateService = inject(FlTranslateService);

  transform(value: FlTranslatableText | Observable<FlTranslatableText>): Observable<string> {
    if (!value) return null;
    if (value instanceof Observable) {
      return value.pipe(mergeMap((value) => this.translateService.translatableTextObs(value)));
    } else {
      return this.translateService.translatableTextObs(value);
    }
  }
}
