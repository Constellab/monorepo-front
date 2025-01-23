import { Pipe, PipeTransform } from '@angular/core';

/**
 * Simple pipe to convert a typing name str to TypingName
 */
@Pipe({
  name: 'tdCleanType',
  standalone: false,
})
export class TdCleanTypePipe implements PipeTransform {
  transform(value: string): string {
    if (value.startsWith('typing')) {
      return value.replace('typing.', '');
    }
    return value;
  }
}
