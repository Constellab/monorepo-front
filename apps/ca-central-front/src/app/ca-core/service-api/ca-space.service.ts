import { Injectable } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import { CaSpace, CaSpaceInfoDto } from '../model/entities/space/ca-space.class';
import { Observable } from 'rxjs';
import { ClHelpService, ClPage } from '@monorepo/core-lib';
import { CaUser, CaUserDatasourcePaginated } from '../model/entities/ca-user.class';
import { CaSpaceSearch, CaSpaceSearchFields } from '../entity-module/ca-space-core/model/ca-space-search.class';
import { CaSpaceRole, CaSpaceUser } from '../model/entities/space/ca-space-user.class';
import {
  CaSpaceUserSearch,
  CaSpaceUserSearchFields
} from '../entity-module/ca-space-core/model/ca-space-user-search.class';
import {
  CaCreateSpaceDTO,
  CaRequestNewLicensesDto,
  CaSpaceSettingsDto,
  CaSpaceStorage,
  CaSpaceUpdateStorageLocationDTO
} from '../model/entities/space/ca-space.dto';
import { CaFolderStorageUsageDTO } from '../model/entities/folder/ca-document.class';

@Injectable({
  providedIn: 'root'
})
export class CaSpaceService {

  private readonly route: string = 'spaces';

  constructor(private apiService: FlApiService) {
  }


  createEntrepriseSpace(object: CaCreateSpaceDTO): Observable<CaSpaceSettingsDto> {
    return this.apiService.post(this.route + '/entreprise', object, CaSpaceSettingsDto);
  }

  public updateCurrentSpaceName(name: string): Observable<CaSpace> {
    return this.apiService.put(`${this.route}/current-space/name/${name}`, null, CaSpace);

  }

  getById(id: string): Observable<CaSpace> {
    return this.apiService.getById(this.route, id, CaSpace);
  }

  deleteById(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getCurrentInfo(): Observable<CaSpaceInfoDto> {
    return this.apiService.get(`${this.route}/current-info`, CaSpaceInfoDto);
  }

  public getCurrentSpaceSettings(): Observable<CaSpaceSettingsDto> {
    return this.apiService.get(`${this.route}/current-space/settings`, CaSpaceSettingsDto);
  }

  public getMySpaces(): Observable<CaSpace[]> {
    return this.apiService.get(`${this.route}/my-spaces`, CaSpace);
  }

  public getSpacesOfUser(userId: string): Observable<CaSpace[]> {
    return this.apiService.get(`${this.route}/user/${userId}`, CaSpace);
  }

  public getAll(page: number, size: number): Observable<ClPage<CaSpace>> {
    return this.apiService.get(`${this.route}`, CaSpace,
      { page: page, pageSize: size, resultIsPaginated: true });
  }

  public uploadSpacePhoto(spaceId: string, photo: File): Observable<CaSpace> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.apiService.put(`${this.route}/${spaceId}/photo`, formData, CaSpace);
  }

  public deleteSpacePhoto(spaceId: string): Observable<CaSpace> {
    return this.apiService.delete(`${this.route}/${spaceId}/photo`, CaSpace);
  }

  public getSpacePhoto(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/photo/${filename}`);
  }

  public search(page: number, pageSize: number,
                data: FlDatasourceGetPageData<CaSpaceSearchFields>): Observable<ClPage<CaSpace>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data,
      CaSpaceSearch.filterConverter, CaSpaceSearch.sortConverter);
    return this.apiService.post(`${this.route}/search`, searchInput, CaSpace, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNames(name: string, page: number, pageSize: number): Observable<ClPage<CaSpace>> {
    return this.apiService.get(`${this.route}/search/name/${name}`, CaSpace, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  ////////////////////////////////// LICENSE //////////////////////////////////////
  public requestNewLicenses(request: CaRequestNewLicensesDto): Observable<void> {
    return this.apiService.post(`${this.route}/current-space/licenses/request-new-licenses`, request);
  }

  ////////////////////////////////// STORAGE //////////////////////////////////////
  public updateCurrentSpaceStorageLocation(location: CaSpaceUpdateStorageLocationDTO): Observable<CaSpaceStorage> {
    return this.apiService.put(`${this.route}/current-space/storage/location`, location, CaSpaceStorage);
  }

  public getCurrentSpaceStorage(): Observable<CaSpaceStorage> {
    return this.apiService.get(`${this.route}/current-space/storage`, CaSpaceStorage);
  }

  public getCurrentSpaceStorageUsageDetail(): Observable<CaFolderStorageUsageDTO> {
    return this.apiService.get(`${this.route}/current-space/storage/usage-detail`, CaFolderStorageUsageDTO);
  }

  public updateCurrentSpaceStorageLimit(storageLimit: number): Observable<CaSpaceStorage> {
    return this.apiService.put(`${this.route}/current-space/storage/limit/${storageLimit}`, null, CaSpaceStorage);
  }

  ////////////////////////////////// USER //////////////////////////////////////

  public addUserToSpace(spaceId: string, userId: string): Observable<CaSpaceUser> {
    return this.apiService.post(`${this.route}/${spaceId}/user/${userId}`, null, CaSpaceUser);
  }

  public removeUserFromSpace(spaceId: string, userId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${spaceId}/user/${userId}`);
  }

  public activateUser(spaceId: string, userId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${spaceId}/user/${userId}/activate`, null);
  }

  public deactivateUser(spaceId: string, userId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${spaceId}/user/${userId}/deactivate`, null);
  }

  public updateUserRole(spaceId: string, userId: string, role: CaSpaceRole): Observable<void> {
    return this.apiService.put(`${this.route}/${spaceId}/user/${userId}/role/${role}`, null);
  }

  /**
   * Return the list of user for a space (not SpaceUser)
   */
  public getSpaceSimpleUsers(spaceId: string, page: number, size: number): Observable<ClPage<CaUser>> {
    return this.apiService.get(`${this.route}/${spaceId}/user-simple`, CaUser,
      { page: page, pageSize: size, resultIsPaginated: true });
  }

  public getSpaceSimpleUsersDatasource(spaceId: string): CaUserDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getSpaceSimpleUsers(spaceId, page, size), 20);
  }

  public searchSpaceUsers(spaceId: string, page: number, pageSize: number,
                          data: FlDatasourceGetPageData<CaSpaceUserSearchFields>): Observable<ClPage<CaSpaceUser>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data,
      CaSpaceUserSearch.filterConverter, CaSpaceUserSearch.sortConverter);
    return this.apiService.post(`${this.route}/${spaceId}/user/search`, searchInput, CaSpaceUser, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchSpaceUsersByName(spaceId: string, name: string, page: number, pageSize: number): Observable<ClPage<CaUser>> {
    if (ClHelpService.isNullOrEmpty(name)) name = '';
    return this.apiService.get(`${this.route}/${spaceId}/user/search/name/${name}`, CaUser, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchSpaceUsersByNameDatasource(spaceId: string): CaUserDatasourcePaginated<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page, size, data) => this.searchSpaceUsersByName(spaceId, data.filtersCriteria.searchText, page, size), 20, false);
  }


  ////////////////////////////////// OTHERS //////////////////////////////////

  public generateAllUserPersonalSpace(): Observable<void> {
    return this.apiService.post(`${this.route}/generate-all-user-personal-space`, null);
  }

  // for now this route is here to check if the current user has a common space with requested user
  public getUserById(userId: string): Observable<CaUser> {
    return this.apiService.get(`${this.route}/find-user/${userId}`, CaUser);
  }
}

