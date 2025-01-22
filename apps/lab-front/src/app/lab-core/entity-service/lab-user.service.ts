import { Injectable, inject } from '@angular/core';
import { FlApiService, FlEntityPaginatedDatasource, FlInputSearchFilter } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabUser, LabUserDatasourcePaginated } from '../model/entities/lab-user.entity';
import { ClPageI } from '@monorepo/core-lib';

@Injectable({ providedIn: 'root' })
export class LabUserService {
  private apiService = inject(FlApiService);

  private readonly route = 'user';

  public searchByName(name: string, page: number, pageSize: number): Observable<ClPageI<LabUser>> {
    return this.apiService.get(`${this.route}/name-search/${name}`, LabUser, {
      page,
      pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNameDatasource(): LabUserDatasourcePaginated<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page, size, data) => this.searchByName(data.filtersCriteria.searchText, page, size),
      20,
      { initFirstPage: false }
    );
  }

  public getUserById(userId: string): Observable<LabUser> {
    return this.apiService.get(`${this.route}/${userId}`, LabUser);
  }
}
