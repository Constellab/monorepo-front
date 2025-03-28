import { ClPageI } from '@monorepo/core-lib';
import { FlApiWithCacheService } from '@monorepo/front-core-lib/fl-api';
import { Injectable, inject } from '@angular/core';
import { LiViewModel } from '../model/global/li-view-model.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LiModelService {
  private apiService = inject(FlApiWithCacheService);

  private readonly route: string = 'model';

  public countDatabaseEntries(typingName: string): Observable<number> {
    return this.apiService.get(`${this.route}/${typingName}/count`).pipe(
      map((value) => {
        if (typeof value === 'number') {
          return value;
        } else {
          throw new Error(value);
        }
      })
    );
  }

  public search(search: any, page: number, pageSize: number): Observable<ClPageI<any>> {
    return this.apiService.post(
      `${this.route}/${search.typingName}/search`,
      { search_text: search.searchText },
      LiViewModel,
      { resultIsPaginated: true, page: page, pageSize: pageSize }
    );
  }
}
