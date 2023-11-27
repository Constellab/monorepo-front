import {Pipe, PipeTransform} from '@angular/core';
import {FlQuillJson} from '../../model/fl-text-editor.class';

/**
 * Pipe to check if a rich text is empty
 */
@Pipe({
  name: 'flRichTextIsEmpty',
})
export class FlRichTextIsEmptyPipe implements PipeTransform {
  transform(richText: FlQuillJson): boolean {
    return !richText || !richText.ops || richText.ops.length === 0;
  }
}
