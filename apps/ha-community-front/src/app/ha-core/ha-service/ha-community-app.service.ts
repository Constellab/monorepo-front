import { inject, Injectable } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceSortCriteria, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { TeBlockFigureUploadedResponse, TeRichText } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { HaProfileDatasourceFilters } from '../../ha-profile/component/ha-profile/ha-profile.component';
import {
  HaCoAuthorInvite,
  HaCommunityAppCoAuthorInvite,
} from '../entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaCoAuthorService } from '../entity-module/ha-co-author-core/model/ha-co-author-service';
import { HaFile } from '../entity-module/ha-file-core/model/ha-file';
import {
  HaCommunityApp,
  HaCommunityAppDatasourceFilters,
  HaCommunityAppDatasourcePaginated,
  HaCommunityAppEdit,
} from '../ha-model/ha-entities/ha-community-app.class';
import { HaUser } from '../ha-model/ha-entities/ha-user';

@Injectable({
  providedIn: 'root',
})
export class HaCommunityAppService implements HaCoAuthorService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'app';

  private getAll(
    spacesFilter: string[],
    titleFilter: string,
    sortsCriteria: FlDatasourceSortCriteria[] = [],
    page: number,
    size: number
  ): Observable<ClPage<HaCommunityApp>> {
    return this.apiService.post(
      `${this.route}/filters`,
      { spacesFilter: spacesFilter, titleFilter: titleFilter, sortsCriteria: sortsCriteria },
      HaCommunityApp,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  public getAllPaginated(
    pageSize: number = 10
  ): HaCommunityAppDatasourcePaginated<HaCommunityAppDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAll(
          requestData.filtersCriteria.spacesFilter ?? [],
          requestData.filtersCriteria.titleFilter ?? '',
          requestData.sortsCriteria,
          page,
          size
        ),
      pageSize,
      {
        initFirstPage: false,
      }
    );
  }

  private getUserCommunityApps(
    userId: string,
    page: number,
    size: number
  ): Observable<ClPage<HaCommunityApp>> {
    return this.apiService.get(`${this.route}/user/${userId}`, HaCommunityApp, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public deleteApp(id: string): Observable<boolean> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public getUserCommunityAppsPaginated(
    pageSize = 4
  ): HaCommunityAppDatasourcePaginated<HaProfileDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getUserCommunityApps(requestData.filtersCriteria.userId ?? '', page, size),
      pageSize,
      { initFirstPage: false }
    );
  }

  public getById(id: string): Observable<HaCommunityApp> {
    return this.apiService.get(`${this.route}/${id}`, HaCommunityApp);
  }

  public create(appEdit: HaCommunityAppEdit): Observable<HaCommunityApp> {
    return this.apiService.post(this.route, appEdit, HaCommunityApp);
  }

  public update(appEdit: HaCommunityAppEdit): Observable<HaCommunityApp> {
    return this.apiService.put(this.route, appEdit, HaCommunityApp);
  }

  public getAppPictureUrl(picture: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/app-picture/${picture}`);
  }

  public uploadAppPicture(picture: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', picture);
    return this.apiService.post(`${this.route}/app-picture`, formData);
  }

  public deleteFile(filename: string): Observable<any> {
    return this.apiService.delete(`${this.route}/app-picture/${filename}`);
  }

  uploadImage(file: File, appId: string): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/image/${appId}`, formData);
  }

  getImageUrl(appId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${appId}/image/${name}`);
  }

  uploadFile(file: File, appId: string): Observable<HaFile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${appId}`, formData);
  }

  public getAppFilePathPrefix(appId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${appId}/file/`);
  }

  public getAppFilePath(appId: string, appFileId: string): string {
    return `${this.getAppFilePathPrefix(appId)}${appFileId}`;
  }

  public renameFile(appFileId: string, newName: string): Observable<HaFile> {
    return this.apiService.put(`${this.route}/file/${appFileId}/rename`, { humanName: newName }, HaFile);
  }

  public updateAppDescription(appId: string, description: TeRichText): Observable<HaCommunityApp> {
    return this.apiService.put(
      `${this.route}/description/${appId}`,
      { description: description },
      HaCommunityApp
    );
  }

  getCoAuthors(id: string): Observable<HaUser[]> {
    return this.apiService.get(`${this.route}/co-authors/${id}`, HaUser);
  }
  getCoAuthorsPendingInvites(id: string): Observable<HaCoAuthorInvite[]> {
    return this.apiService.get(
      `${this.route}/co-authors/${id}/pending-invites`,
      HaCommunityAppCoAuthorInvite,
      {
        resultIsPaginated: false,
      }
    );
  }
  removeCoAuthor(id: string, coAuthorId: string): Observable<HaCommunityApp> {
    return this.apiService.put(`${this.route}/co-authors/${id}/remove/${coAuthorId}`, {}, HaCommunityApp);
  }
  deleteCoAuthorInvite(inviteId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/co-authors/invite/${inviteId}`);
  }
  inviteCoAuthor(id: string, emailOrId: string): Observable<boolean> {
    return this.apiService.post(`${this.route}/co-authors/${id}/invite`, { emailOrId: emailOrId }, Boolean);
  }
  isCoAuthorInviteValid(token: string): Observable<HaCommunityAppCoAuthorInvite> {
    return this.apiService.get(
      `${this.route}/co-authors/invite/${token}/is-valid`,
      HaCommunityAppCoAuthorInvite
    );
  }
  acceptInvite(token: string): Observable<HaCommunityApp> {
    return this.apiService.put(`${this.route}/co-authors/invite/${token}/accept`, {}, HaCommunityApp);
  }

  updateAppMedia(appId: string, videoUrl: string | null, figures: string[]): Observable<HaCommunityApp> {
    return this.apiService.put(
      `${this.route}/media/${appId}`,
      { video: videoUrl, figures: figures },
      HaCommunityApp
    );
  }

  rearrangeMedias(appId: string, figures: string[]): Observable<HaCommunityApp> {
    return this.apiService.put(
      `${this.route}/rearrange-medias/${appId}`,
      { figures: figures },
      HaCommunityApp
    );
  }
}
