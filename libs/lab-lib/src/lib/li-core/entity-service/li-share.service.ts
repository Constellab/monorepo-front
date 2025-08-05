import { HttpHeaders } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import {
  LiSharedEntity,
  LiSharedEntityDatasource,
  LiShareLinkEntityType,
  LiShareLinkPublicAuth,
} from '../model/entities/li-share.entity';
import { LiResourceView } from '../model/entities/resource/li-resource-view.entity';
import { LiResourceService } from './li-resource.service';

@Injectable({
  providedIn: 'root',
})
export class LiShareService {
  private apiService = inject(FlApiService);

  private route: string = 'share';

  public getSharedTo(
    entityType: LiShareLinkEntityType,
    entityId: string,
    page: number,
    size: number
  ): Observable<ClPageI<LiSharedEntity>> {
    return this.apiService.get(`${this.route}/${entityType}/${entityId}/shared-to`, LiSharedEntity, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getSharedToDatasource(
    entityType: LiShareLinkEntityType,
    entityId: string
  ): LiSharedEntityDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.getSharedTo(entityType, entityId, page, pageSize),
      20
    );
  }

  /////////////////////////////////// RESOURCE ///////////////////////////////////
  public callDefaultViewOnResource(auth: LiShareLinkPublicAuth): Observable<LiResourceView> {
    return this.callViewOnResource(auth, LiResourceService.defaultViewName, {}, true);
  }

  public callViewOnResource(
    auth: LiShareLinkPublicAuth,
    viewMethodName: string,
    configValues: TdParamSpecsValues,
    saveViewConfig: boolean = false
  ): Observable<LiResourceView> {
    let headers: HttpHeaders = undefined;
    if (auth.userAccessToken) {
      headers = new HttpHeaders({
        gws_user_access_token: auth.userAccessToken,
      });
    }
    return this.apiService.post(
      `${this.route}/resource/${auth.token}/views/${viewMethodName}`,
      {
        values: configValues,
        save_view_config: saveViewConfig,
      },
      LiResourceView,
      { headers: headers }
    );
  }
}
