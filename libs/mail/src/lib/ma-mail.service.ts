import { Injectable, inject } from '@angular/core';
import { FlApiService, FlDatasourceGetPageData, FlSearchConverter } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { ClPage } from '@monorepo/core-lib';
import { MaMailSearch, MaMailSearchFields } from './models/ma-mail-search.class';
import { MaMailEntity } from './models/ma-mail.entity';

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
