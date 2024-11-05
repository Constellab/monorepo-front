import { Pipe, PipeTransform } from '@angular/core';
import { FlTag, FlTagHelper } from '../fl-tag.class';
import { FlTagColorer } from '../fl-tag-colorer.class';
import { Observable, of } from 'rxjs';

/**
 * If the tag has a color, use it,
 * otherwise generate a color from the tag key and value
 */
@Pipe({
  name: 'flTagColor',
})
export class FlTagColorPipe implements PipeTransform {
  transform(tag: FlTag | string, tagColorer?: FlTagColorer): Observable<string> {
    if (tag == null) return of('');

    const formattedTag = typeof tag === 'string' ? { key: tag } : tag;

    if (tagColorer) {
      return tagColorer.getTagColor$(formattedTag);
    }

    return of(FlTagHelper.getTagDefaultColor(formattedTag.key));
  }
}
