import { Pipe, PipeTransform } from '@angular/core';
import { TeRichText } from '../../model/lib';

@Pipe({
  name: 'teRichTextIsEmpty',
})
export class TeRichTextIsEmptyPipe implements PipeTransform {
  transform(richText: TeRichText): boolean {
    if (richText == null) return true;
    return richText.isEmpty();
  }
}
