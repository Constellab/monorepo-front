import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  LabSharedEntity,
  LabSharedEntityDatasource,
  LabShareLinkType,
} from '../model/entities/lab-share.entity';
import { Observable } from 'rxjs';
import { ClPageI } from '@monorepo/core-lib';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';
import { PrConfigValues } from '@monorepo/protocol';
import { LabResourceService } from './lab-resource.service';

@Injectable({
  providedIn: 'root',
})
export class LabShareService {
  private apiService = inject(FlApiService);

  private route: string = 'share';

  public getSharedTo(
    entityType: LabShareLinkType,
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

  public getSharedToDatasource(entityType: LabShareLinkType, entityId: string): LabSharedEntityDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.getSharedTo(entityType, entityId, page, pageSize),
      20
    );
  }

  /////////////////////////////////// RESOURCE ///////////////////////////////////
  public callDefaultViewOnResource(token: string): Observable<LabResourceView> {
    return this.callViewOnResource(token, LabResourceService.defaultViewName, {}, true);
  }

  public callViewOnResource(
    token: string,
    viewMethodName: string,
    configValues: PrConfigValues,
    saveViewConfig: boolean = false
  ): Observable<LabResourceView> {
    return this.apiService.post(
      `${this.route}/resource/${token}/views/${viewMethodName}`,
      {
        values: configValues,
        save_view_config: saveViewConfig,
      },
      LabResourceView
    );
  }
}
