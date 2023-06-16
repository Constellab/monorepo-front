import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {CaGroup, CaGroupDatasource, CaUserGroup} from '../model/entities/ca-group.entity';
import {ClPage, ClPageI} from '@monorepo/core-lib';
import {CaTeamSearch, CaTeamSearchFields} from '../entity-module/ca-group-core/model/ca-team.search.class';

@Injectable({
  providedIn: 'root'
})
export class CaGroupService {

  private readonly route = 'groups';
  private readonly teamRoute = this.route + '/teams';

  constructor(private apiService: FlApiService) {
  }

  public getAllCurrentGroups(page: number, size: number): Observable<ClPageI<CaGroup>> {
    return this.apiService.get(`${this.route}/all-current`, CaGroup,
      {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getAllCurrentGroupsDatasource(): CaGroupDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllCurrentGroups(page, size), 20);
  }


  ///////////////////////////// TEAMS ////////////////////////////////////

  public getTeamById(id: string): Observable<CaGroup> {
    return this.apiService.getById(this.teamRoute, id, CaGroup);
  }

  /**
   * Return the list of the current user's teams
   */
  public getMyTeamsDatasource(pageSize: number = 20): CaGroupDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.getMyTeams(page, pageSize),
      pageSize);
  }

  private getMyTeams(page: number, pageSize: number): Observable<ClPageI<CaGroup>> {
    return this.apiService.get(`${this.teamRoute}/current`, CaGroup,
      {resultIsPaginated: true, page: page, pageSize: pageSize});
  }

  public createTeam(label: string): Observable<CaGroup> {
    return this.apiService.post(`${this.teamRoute}/${label}`, null, CaGroup);
  }

  public updateTeamLabel(groupId: string, label: string): Observable<CaGroup> {
    return this.apiService.put(`${this.teamRoute}/${groupId}/label/${label}`, null, CaGroup);
  }

  public addUserToTeam(groupId: string, userId: string): Observable<CaUserGroup> {
    return this.apiService.post(`${this.teamRoute}/${groupId}/add-user/${userId}`, null, CaUserGroup);
  }

  public removeUserFromTeam(groupId: string, userId: string): Observable<void> {
    return this.apiService.delete(`${this.teamRoute}/${groupId}/remove-user/${userId}`, null);
  }

  public deleteTeamById(groupId: string): Observable<void> {
    return this.apiService.delete(`${this.teamRoute}/${groupId}`);
  }

  public getUsersOfTeam(groupId: string, page: number, size: number): Observable<ClPage<CaUserGroup>> {
    return this.apiService.get(`${this.teamRoute}/${groupId}/users`, CaUserGroup,
      {page: page, pageSize: size, resultIsPaginated: true});
  }


  public searchTeamInCurrentSpace(page: number, pageSize: number, filters?: CaTeamSearchFields): Observable<ClPageI<CaGroup>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, CaTeamSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.teamRoute}/current-space/search`, data, CaGroup, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }
}
