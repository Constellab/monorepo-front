import { inject, Injectable } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { Observable } from 'rxjs';

import { MaMailEntity } from './models/ma-mail.entity';
import { MaMailSearch, MaMailSearchFields } from './models/ma-mail-search.class';

@Injectable({ providedIn: 'root' })
export class MaMailService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'mails';

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<MaMailSearchFields>
  ): Observable<ClPage<MaMailEntity>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      MaMailSearch.filterConverter,
      MaMailSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, MaMailEntity, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public resendMail(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/resend`, null, null);
  }
}
