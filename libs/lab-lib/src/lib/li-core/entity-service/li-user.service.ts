import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { Injectable, inject } from '@angular/core';
import { LiUser, LiUserDatasourcePaginated } from '../model/entities/li-user.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiUserService {
  private apiService = inject(FlApiService);

  private readonly route = 'user';

  public searchByName(name: string, page: number, pageSize: number): Observable<ClPageI<LiUser>> {
    return this.apiService.get(`${this.route}/name-search/${name}`, LiUser, {
      page,
      pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNameDatasource(): LiUserDatasourcePaginated<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page, size, data) => this.searchByName(data.filtersCriteria.searchText, page, size),
      20,
      { initFirstPage: false }
    );
  }

  public getUserById(userId: string): Observable<LiUser> {
    return this.apiService.get(`${this.route}/${userId}`, LiUser);
  }
}
