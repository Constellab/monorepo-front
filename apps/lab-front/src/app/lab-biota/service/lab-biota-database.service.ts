import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';
import { LabBiotaData, LabBiotaDataDatasource } from '../model/lab-biota-data.class';
import { ClPageI } from '@monorepo/core-lib';
import { LabBiotaDatabaseSearch } from '../model/lab-biota-database.class';
import { LabModelService } from '../../lab-core/service/lab-model.service';

@Injectable({
  providedIn: 'root',
})
export class LabBiotaDatabaseService {
  private apiService = inject(FlApiService);
  private modelService = inject(LabModelService);

  public countDatabaseEntries(typingName: string): Observable<number> {
    return this.modelService.countDatabaseEntries(typingName);
  }

  public getDatabaseData(
    typingName: string,
    page: number,
    pageSize: number
  ): Observable<ClPageI<LabBiotaData>> {
    return this.apiService.get(`resource/${typingName}/`, LabBiotaData, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }

  public getDatabaseDatasource(typingName: string): LabBiotaDataDatasource {
    return new FlEntityPaginatedDatasource<LabBiotaData>(
      (page: number, pageSize: number): Observable<ClPageI<LabBiotaData>> =>
        this.getDatabaseData(typingName, page, pageSize),
      20
    );
  }

  public searchDatasource(search: LabBiotaDatabaseSearch): LabBiotaDataDatasource {
    return new FlEntityPaginatedDatasource<LabBiotaData>(
      (page: number, pageSize: number): Observable<ClPageI<LabBiotaData>> =>
        this.modelService.search(search, page, pageSize),
      20
    );
  }
}
