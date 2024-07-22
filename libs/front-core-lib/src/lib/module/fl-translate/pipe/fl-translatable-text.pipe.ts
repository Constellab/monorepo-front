import { Pipe, PipeTransform } from '@angular/core';
import { FlTranslateService } from '../service/fl-translate.service';
import { FlTranslatableText } from '../model/fl-translate-param';

/**
 * Pipe to translate or not a {@link FlTranslatableText}
 */
@Pipe({
  name: 'flTranslatableText',
  pure: false
})
export class FlTranslatableTextPipe implements PipeTransform {

  constructor(private translateService: FlTranslateService) {
  }


  transform(value: FlTranslatableText): string {
    return this.translateService.translatableText(value);
  }

}
