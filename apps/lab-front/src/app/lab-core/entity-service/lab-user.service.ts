import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {LabUser, LabUserDatasourcePaginated} from '../model/entities/lab-user.entity';
import {ClPageI} from '@monorepo/core-lib';

@Injectable({providedIn: 'root'})
export class LabUserService {

  private readonly route = 'user';

  constructor(private apiService: FlApiService) {
  }

  public searchByName(name: string, page: number, pageSize: number): Observable<ClPageI<LabUser>> {
    return this.apiService.get(`${this.route}/name-search/${name}`, LabUser,
      {page, pageSize, resultIsPaginated: true});
  }

  public searchByNameDatasource(): LabUserDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size, name) => this.searchByName(name, page, size), 20, false);
  }

  public getUserById(userId: string): Observable<LabUser> {
    return this.apiService.get(`${this.route}/${userId}`, LabUser);
  }
}
