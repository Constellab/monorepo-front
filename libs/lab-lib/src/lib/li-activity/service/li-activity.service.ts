import { inject,Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { LiActivity } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiActivitySearch, LiActivitySearchFields } from '../model/li-activity-search.class';

@Injectable({
  providedIn: 'root',
})
export class LiActivityService {
  private apiService = inject(FlApiService);

  private route = 'activity';

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiActivitySearchFields>
  ): Observable<ClPageI<LiActivity>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiActivitySearch.filterConverter,
      LiActivitySearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiActivity, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }
}
