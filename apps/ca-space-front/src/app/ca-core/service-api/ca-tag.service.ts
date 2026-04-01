import { inject, Injectable, OnDestroy } from '@angular/core';
import { ClPageI, ClStringHelper } from '@monorepo/core-lib';
import { FlTagSearchFilter, FlTagSearchResult, FlTagService } from '@monorepo/front-core-lib/fl-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaAvailableTagDatasource } from '../model/entities/ca-tag.class';
import { CaHierarchyObjectService } from './ca-hierarchy-object.service';

/**
 *  Service to search tag available of
 */
@Injectable()
export class CaTagService extends FlTagService implements OnDestroy {
  private hierarchyObjectService = inject(CaHierarchyObjectService);

  public availableTags: CaAvailableTagDatasource = new CaAvailableTagDatasource();

  private folderId: string;
  private clearDatasource: boolean = true;

  public initFromObject(hierarchyObjectId: string): void {
    if (this.folderId === hierarchyObjectId) return;
    this.availableTags.clear();

    this.hierarchyObjectService.getAvailableTags(hierarchyObjectId).subscribe((tags) => {
      this.availableTags.setData(tags.tags);
    });
  }

  public initFromChildren(hierarchyObjectId: string): void {
    this.availableTags.clear();

    this.hierarchyObjectService.getAvailableTagsInChildren(hierarchyObjectId).subscribe((tags) => {
      this.availableTags.setData(tags.tags);
    });
  }

  public initFromTags(tags: CaAvailableTagDatasource): void {
    if (this.availableTags) {
      this.availableTags.manualDisconnect();
    }
    this.availableTags = tags;
    // do not clear the datasource on complete as it is not managed by this service
    this.clearDatasource = false;
  }

  searchTag(filters: Partial<FlTagSearchFilter>): Observable<ClPageI<FlTagSearchResult>> {
    if (filters.value == null) {
      return this.availableTags.connect().pipe(
        map((tags) => {
          const keys = tags.map((tag) => tag.key);
          return this.filterStrResult(keys, filters.key, 'key');
        })
      );
    }

    return this.availableTags.connect().pipe(
      map((tags) => {
        const matchingTag = tags.find((tag) => tag.key === filters.key);
        const values = matchingTag?.values.map((value) => value.toString()) ?? [];
        return this.filterStrResult(values, filters.value, 'value');
      })
    );
  }

  searchCommunityTag(): Observable<ClPageI<FlTagSearchResult>> {
    // TODO: Implement community tag search for space if needed
    return null;
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
    if (this.clearDatasource) {
      this.availableTags.manualDisconnect();
    }
  }
}
