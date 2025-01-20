import { Pipe, PipeTransform } from '@angular/core';
import { FlTranslateService } from '../service/fl-translate.service';
import { FlTranslatableText } from '../model/fl-translate-param';
import { mergeMap, Observable } from 'rxjs';

/**
 * Pipe to translate or not a {@link FlTranslatableText}
 */
@Pipe({
    name: 'flTranslatableText',
    standalone: false
})
export class FlTranslatableTextPipe implements PipeTransform {
  constructor(private translateService: FlTranslateService) {}

  transform(value: FlTranslatableText | Observable<FlTranslatableText>): Observable<string> {
    if (!value) return null;
    if (value instanceof Observable) {
      return value.pipe(mergeMap((value) => this.translateService.translatableTextObs(value)));
    } else {
      return this.translateService.translatableTextObs(value);
    }
  }
}
