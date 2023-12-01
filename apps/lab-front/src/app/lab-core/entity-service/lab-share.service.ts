import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {LabSharedEntity, LabSharedEntityDatasource, LabShareLinkType} from '../model/entities/lab-share.entity';
import {Observable} from 'rxjs';
import {ClPageI} from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root'
})
export class LabShareService {

  private route: string = 'share';

  constructor(private apiService: FlApiService) {
  }

  public getSharedTo(entityType: LabShareLinkType, entityId: string, page: number, size: number): Observable<ClPageI<LabSharedEntity>> {
    return this.apiService.get(`${this.route}/${entityType}/${entityId}/shared-to`, LabSharedEntity,
      {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getSharedToDatasource(entityType: LabShareLinkType, entityId: string): LabSharedEntityDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.getSharedTo(entityType, entityId, page, pageSize), 20);
  }
}
