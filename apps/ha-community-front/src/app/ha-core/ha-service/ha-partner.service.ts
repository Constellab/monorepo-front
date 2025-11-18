import { inject, Injectable } from '@angular/core';
import { ClPage, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FlDatasourceGetPageData,
  FlDatasourceSortCriteria,
  FlEntityPaginatedDatasource,
} from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { RvResourceView } from '@monorepo/resource-view';
import { TeBlockFigureUploadedResponse } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import {
  HaAdminPanelPartnerSearch,
  HaAdminPanelPartnerSearchFields,
} from '../../ha-admin/model/ha-admin-panel-partner-search.class';
import { HaFile } from '../entity-module/ha-file-core/model/ha-file';
import {
  HaEditPartnerDto,
  HaPartner,
  HaPartnerDatasourceFilters,
  HaPartnerDatasourcePaginated,
  HaPartnerDetail,
} from '../ha-model/ha-entities/ha-partner';

@Injectable({
  providedIn: 'root',
})
export class HaPartnerService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'partner';

  getAllPartners(): Observable<HaPartner[]> {
    return this.apiService.get(`${this.route}`, HaPartner);
  }

  getPartnerById(id: string): Observable<HaPartnerDetail> {
    return this.apiService.get(`${this.route}/${id}`, HaPartnerDetail);
  }

  getPartnerByUserId(userId: string): Observable<HaPartnerDetail> {
    return this.apiService.get(`${this.route}/user/${userId}`, HaPartnerDetail);
  }

  getCurrentUserPartner(): Observable<HaPartnerDetail> {
    return this.apiService.get(`${this.route}/current`, HaPartnerDetail);
  }

  search(
    nameFilter: string,
    sortsCriteria: FlDatasourceSortCriteria[],
    page: number,
    size: number
  ): Observable<ClPageI<HaPartner>> {
    return this.apiService.post(
      `${this.route}/search`,
      {
        nameFilter: nameFilter,
        sorts: sortsCriteria,
      },
      HaPartner,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  searchAllPartners(pageSize: number = 10): HaPartnerDatasourcePaginated<HaPartnerDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.search(requestData.filtersCriteria.nameFilter, requestData.sortsCriteria ?? [], page, size),
      pageSize,
      { initFirstPage: false }
    );
  }

  searchForAdmin(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<HaAdminPanelPartnerSearchFields>
  ): Observable<ClPage<HaPartner>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      HaAdminPanelPartnerSearch.filterConverter,
      HaAdminPanelPartnerSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search-for-admin`, searchInput, HaPartner, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  createPartner(body: HaEditPartnerDto): Observable<HaPartnerDetail> {
    return this.apiService.post(`${this.route}`, body, HaPartnerDetail);
  }

  createPartnerForUser(id: string): Observable<HaPartnerDetail> {
    return this.apiService.post(`${this.route}/${id}`, null, HaPartnerDetail);
  }

  certifyPartner(id: string): Observable<HaPartnerDetail> {
    return this.apiService.post(`${this.route}/${id}/certify`, null, HaPartnerDetail);
  }

  decertifyPartner(id: string): Observable<HaPartnerDetail> {
    return this.apiService.post(`${this.route}/${id}/decertify`, null, HaPartnerDetail);
  }

  updatePartner(id: string, body: HaEditPartnerDto): Observable<HaPartnerDetail> {
    return this.apiService.put(`${this.route}/${id}`, body, HaPartnerDetail);
  }

  updatePartnerInfo(id: string, info: Record<string, any>): Observable<HaPartnerDetail> {
    return this.apiService.put(`${this.route}/${id}/info`, info, HaPartnerDetail);
  }

  //////////////////////////////// FILES ////////////////////////////////
  uploadImage(file: File, partnerId: string): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/image/${partnerId}`, formData);
  }

  getImageUrl(partnerId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${partnerId}/image/${name}`);
  }

  uploadFile(file: File, partnerId: string): Observable<HaFile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${partnerId}`, formData);
  }

  getFilePath(partnerId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${partnerId}/file/${name}`);
  }

  uploadResourceViewFile(partnerId: string, file: FormData): Observable<any> {
    return this.apiService.post(`${this.route}/${partnerId}/view`, file);
  }

  getView(partnerId: string, id: string): Observable<RvResourceView> {
    return this.apiService.get(`${this.route}/${partnerId}/view/${id}`);
  }

  deleteFile(partnerId: string, name: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${partnerId}/file/${name}`);
  }

  uploadLogo(file: File, partnerId: string): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/logo/${partnerId}`, formData);
  }

  deleteLogo(partnerId: string, name: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${partnerId}/logo/${name}`);
  }
}
