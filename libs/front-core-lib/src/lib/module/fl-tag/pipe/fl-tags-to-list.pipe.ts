import { Pipe, PipeTransform } from '@angular/core';
import { FlTag, FlTagDatasource, FlTagValue } from '../fl-tag.class';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Pipe to convert list of tags or record of tags to a list of tags
 */
@Pipe({
  name: 'flTagsToList',
})
export class FlTagsToListPipe implements PipeTransform {
  transform(
    tags: FlTag[] | Record<string, FlTagValue> | FlTagDatasource,
    slice: number = -1
  ): Observable<FlTag[]> {
    if (tags == null) return of([]);

    let obs: Observable<FlTag[]>;
    if (tags instanceof FlTagDatasource) {
      obs = tags.connect();
    } else if (Array.isArray(tags)) {
      obs = of(tags);
    } else {
      obs = of(this.recordToList(tags));
    }

    if (slice > 0) {
      return obs.pipe(map((values: FlTag[]) => values.slice(0, slice)));
    }
    return obs;
  }

  private recordToList(tags: Record<string, FlTagValue>): FlTag[] {
    return Object.keys(tags).map((key) => ({ key: key, value: tags[key] }));
  }
}
