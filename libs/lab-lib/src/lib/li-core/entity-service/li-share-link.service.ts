import { inject, Injectable } from '@angular/core';
import { ClDateHelper, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import {
  LiCleanShareLinks,
  LiShareLink,
  LiShareLinkDatasource,
  LiShareLinkEntityType,
  LiShareLinkType,
} from '../model/entities/li-share.entity';

@Injectable({
  providedIn: 'root',
})
export class LiShareLinkService {
  private apiService = inject(FlApiService);

  private route: string = 'share-link';

  public createPublicShareLink(shareLink: Partial<LiShareLink>): Observable<LiShareLink> {
    return this.apiService.post(`${this.route}/public`, shareLink, LiShareLink, {
      serialization: LiShareLink,
    });
  }

  public update(shareLinkId: string, validUntil: DateTime | null): Observable<LiShareLink> {
    return this.apiService.put(
      `${this.route}/${shareLinkId}`,
      { valid_until: ClDateHelper.serializeDate(validUntil) },
      LiShareLink
    );
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getAll(page: number, size: number): Observable<ClPageI<LiShareLink>> {
    return this.apiService.get(this.route, LiShareLink, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getAllDatasource(): LiShareLinkDatasource {
    return new FlEntityPaginatedDatasource((page, size) => this.getAll(page, size), 20);
  }

  public getDownloadLink(entityType: LiShareLinkEntityType, token: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${entityType.toLowerCase()}/download/${token}`);
  }

  public getShareLink(
    entityType: LiShareLinkEntityType,
    entityId: string,
    linkType: LiShareLinkType
  ): Observable<LiShareLink> {
    return this.apiService.get(`${this.route}/${entityType}/${entityId}/${linkType}`, LiShareLink);
  }

  public cleanLinks(cleanDTO: LiCleanShareLinks): Observable<void> {
    return this.apiService.post(`${this.route}/clean`, cleanDTO);
  }
}
