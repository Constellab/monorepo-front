import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  LabCleanShareLinks,
  LabShareLink,
  LabShareLinkDatasource,
  LabShareLinkEntityType,
  LabShareLinkType,
} from '../model/entities/lab-share.entity';
import { Observable } from 'rxjs';
import { ClDateHelper, ClPageI } from '@monorepo/core-lib';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class LabShareLinkService {
  private apiService = inject(FlApiService);

  private route: string = 'share-link';

  public createPublicShareLink(shareLink: Partial<LabShareLink>): Observable<LabShareLink> {
    return this.apiService.post(`${this.route}/public`, shareLink, LabShareLink, {
      serialization: LabShareLink,
    });
  }

  public update(shareLinkId: string, validUntil: DateTime): Observable<LabShareLink> {
    return this.apiService.put(
      `${this.route}/${shareLinkId}`,
      { valid_until: ClDateHelper.serializeDate(validUntil) },
      LabShareLink
    );
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getAll(page: number, size: number): Observable<ClPageI<LabShareLink>> {
    return this.apiService.get(this.route, LabShareLink, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getAllDatasource(): LabShareLinkDatasource {
    return new FlEntityPaginatedDatasource((page, size) => this.getAll(page, size), 20);
  }

  public getDownloadLink(entityType: LabShareLinkEntityType, token: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${entityType.toLowerCase()}/download/${token}`);
  }

  public getShareLink(
    entityType: LabShareLinkEntityType,
    entityId: string,
    linkType: LabShareLinkType
  ): Observable<LabShareLink> {
    return this.apiService.get(`${this.route}/${entityType}/${entityId}/${linkType}`, LabShareLink);
  }

  public cleanLinks(cleanDTO: LabCleanShareLinks): Observable<void> {
    return this.apiService.post(`${this.route}/clean`, cleanDTO);
  }
}
