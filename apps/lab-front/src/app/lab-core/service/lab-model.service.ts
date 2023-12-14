import {Injectable} from '@angular/core';
import {FlApiWithCacheService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ClPageI} from '@monorepo/core-lib';
import {LabViewModel} from '../model/global/lab-view-model.entity';

@Injectable({
  providedIn: 'root'
})
export class LabModelService {

  private readonly route: string = 'model';

  constructor(private apiService: FlApiWithCacheService) {
  }

  public countDatabaseEntries(typingName: string): Observable<number> {
    return this.apiService.get(`${this.route}/${typingName}/count`).pipe(
      map(value => {
        if (typeof value === 'number') {
          return value;
        } else {
          throw new Error(value);
        }
      })
    );
  }


  public search(search: any, page: number, pageSize: number): Observable<ClPageI<any>> {
    return this.apiService.post(`${this.route}/${search.typingName}/search`, {search_text: search.searchText}, LabViewModel,
      {resultIsPaginated: true, page: page, pageSize: pageSize});
  }


}
