import { inject, Injectable, OnDestroy } from '@angular/core';
import { FlTagSearchFilter, FlTagSearchResult, FlTagService } from '@monorepo/front-core-lib/fl-tag';
import { Observable } from 'rxjs';
import { ClPageI, ClStringHelper } from '@monorepo/core-lib';
import { CaHierarchyObjectService } from './ca-hierarchy-object.service';
import { CaAvailableTagDatasource } from '../model/entities/ca-tag.class';
import { map } from 'rxjs/operators';

/**
 *  Service to search tag available of
 */
@Injectable()
export class CaTagService extends FlTagService implements OnDestroy {
  private hierarchyObjectService = inject(CaHierarchyObjectService);

  public availableTags: CaAvailableTagDatasource = new CaAvailableTagDatasource();

  private folderId: string;

  public initFromObject(hierarchyObjectId: string): void {
    if (this.folderId === hierarchyObjectId) return;
    this.availableTags.clear();

    this.hierarchyObjectService.getAvailableTags(hierarchyObjectId).subscribe((tags) => {
      this.availableTags.setData(tags.tags);
    });
  }

  public initFromTags(tags: CaAvailableTagDatasource): void {
    this.availableTags = tags;
  }

  searchTag(filters: Partial<FlTagSearchFilter>): Observable<ClPageI<FlTagSearchResult>> {
    // search key
    if (filters.value == null) {
      // search values
      return this.availableTags.connect().pipe(
        map((tags) => tags.map((tag) => tag.key)),
        map((tags) => this.filterStrResult(tags, filters.key, 'key'))
      );
    } else {
      return this.availableTags.connect().pipe(
        map((tags) => {
          const key = tags.find((tag) => tag.key === filters.key);
          if (key) {
            return key.values.map((value) => value);
          }
          return [];
        }),
        map((tags) => tags.map((tag) => tag.toString())),
        map((tags) => this.filterStrResult(tags, filters.value, 'value'))
      );
    }
  }

  /**
   * Filter locally the result
   * @param strResult
   * @param search
   * @param type
   * @private
   */
  private filterStrResult(
    strResult: string[],
    search: string,
    type: 'key' | 'value'
  ): ClPageI<FlTagSearchResult> {
    const filteredArray = strResult.filter((value) =>
      ClStringHelper.stringContains(value, search, true, true, true)
    );

    const result: FlTagSearchResult[] = filteredArray.map((value) => {
      return {
        type: type,
        content: value,
      };
    });
    return {
      first: true,
      last: true,
      totalElements: filteredArray.length,
      pageSize: filteredArray.length,
      currentPage: 0,
      objects: result,
    };
  }

  ngOnDestroy(): void {
    this.availableTags.manualDisconnect();
  }
}
