import { Pipe, PipeTransform } from '@angular/core';
import { FlTagHelper, FlTagValue } from '../fl-tag.class';

@Pipe({
  name: 'flTagValueToString',
  standalone: false,
})
export class FlTagValueToStringPipe implements PipeTransform {
  transform(value: FlTagValue): string {
    return FlTagHelper.tagValueToString(value);
  }
}
