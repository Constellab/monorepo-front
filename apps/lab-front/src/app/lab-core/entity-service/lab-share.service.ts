import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  LabSharedEntity,
  LabSharedEntityDatasource,
  LabShareLinkEntityType,
  LabShareLinkPublicAuth,
} from '../model/entities/lab-share.entity';
import { Observable } from 'rxjs';
import { ClPageI } from '@monorepo/core-lib';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';
import { LabResourceService } from './lab-resource.service';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LabShareService {
  private apiService = inject(FlApiService);

  private route: string = 'share';

  public getSharedTo(
    entityType: LabShareLinkEntityType,
    entityId: string,
    page: number,
    size: number
  ): Observable<ClPageI<LabSharedEntity>> {
    return this.apiService.get(`${this.route}/${entityType}/${entityId}/shared-to`, LabSharedEntity, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getSharedToDatasource(
    entityType: LabShareLinkEntityType,
    entityId: string
  ): LabSharedEntityDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.getSharedTo(entityType, entityId, page, pageSize),
      20
    );
  }

  /////////////////////////////////// RESOURCE ///////////////////////////////////
  public callDefaultViewOnResource(auth: LabShareLinkPublicAuth): Observable<LabResourceView> {
    return this.callViewOnResource(auth, LabResourceService.defaultViewName, {}, true);
  }

  public callViewOnResource(
    auth: LabShareLinkPublicAuth,
    viewMethodName: string,
    configValues: TdParamSpecsValues,
    saveViewConfig: boolean = false
  ): Observable<LabResourceView> {
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
      LabResourceView,
      { headers: headers }
    );
  }
}
