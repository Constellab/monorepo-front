import {Pipe, PipeTransform} from '@angular/core';
import {TeRichText, TeRichTextContent} from '../../model/te-rich-text.class';

@Pipe({
  name: 'teRichTextIsEmpty',
})
export class TeRichTextIsEmptyPipe implements PipeTransform {
  transform(richText: TeRichTextContent): boolean {
    return TeRichText.isEmpty(richText);
  }
}
