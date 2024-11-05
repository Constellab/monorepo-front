import { Injectable } from '@angular/core';
import { FlApiService, FlDatasourceGetPageData, FlSearchConverter } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { ClPageI } from '@monorepo/core-lib';
import {
  LabActivitySearch,
  LabActivitySearchFields,
} from '../entity-module/lab-activity-core/model/lab-activity-search.class';
import { LabActivity } from '../model/entities/lab-activity.entity';

@Injectable({
  providedIn: 'root',
})
export class LabActivityService {
  private route = 'activity';

  constructor(private apiService: FlApiService) {}

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LabActivitySearchFields>
  ): Observable<ClPageI<LabActivity>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LabActivitySearch.filterConverter,
      LabActivitySearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LabActivity, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }
}
