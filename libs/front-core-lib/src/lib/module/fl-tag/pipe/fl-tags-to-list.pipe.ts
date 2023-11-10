import {Pipe, PipeTransform} from '@angular/core';
import {FlTag, FlTagDatasource, FlTagValue} from '../fl-tag.class';
import {Observable, of} from 'rxjs';

/**
 * Pipe to convert list of tags or record of tags to a list of tags
 */
@Pipe({
  name: 'flTagsToList'
})
export class FlTagsToListPipe implements PipeTransform {

  transform(tags: FlTag[] | Record<string, FlTagValue> | FlTagDatasource,
            slice: number): Observable<FlTag[]> {
    if (tags == null) return of([]);

    if (tags instanceof FlTagDatasource) {
      return tags.connect();
    } else {
      return of(this.recordOrListToList(tags, slice));
    }
  }


  private recordOrListToList(tags: FlTag[] | Record<string, FlTagValue>, slice: number): FlTag[] {
    let tagList: FlTag[];
    if (Array.isArray(tags)) {
      tagList = tags;
    } else {
      tagList = this.recordToList(tags);
    }
    if (slice == null) return tagList;
    return tagList.slice(0, slice);
  }

  private recordToList(tags: Record<string, FlTagValue>): FlTag[] {
    return Object.keys(tags).map(key => ({key: key, value: tags[key]}));
  }

}
