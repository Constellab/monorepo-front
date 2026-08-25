import { Pipe, PipeTransform } from '@angular/core';

import { FlTagValue } from '../fl-tag.class';
import { FlTagHelper } from '../fl-tag.helper';

@Pipe({
  name: 'flTagValueToString',
  standalone: false,
})
export class FlTagValueToStringPipe implements PipeTransform {
  transform(value: FlTagValue): string | null {
    return FlTagHelper.tagValueToString(value);
  }
}
