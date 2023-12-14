import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {LabBiotaData, LabBiotaDataDatasource} from '../model/lab-biota-data.class';
import {LabViewModel} from '../../lab-core/model/global/lab-view-model.entity';
import {ClPageI} from '@monorepo/core-lib';
import {LabBiotaDatabaseSearch} from '../model/lab-biota-database.class';
import {LabModelService} from '../../lab-core/service/lab-model.service';

@Injectable({
  providedIn: 'root'
})
export class LabBiotaDatabaseService {


  constructor(private apiService: FlApiService,
              private modelService: LabModelService) {
  }

  public countDatabaseEntries(typingName: string): Observable<number> {
    return this.modelService.countDatabaseEntries(typingName);
  }

  public getDatabaseData(typingName: string, page: number, pageSize: number): Observable<ClPageI<LabBiotaData>> {
    return this.apiService.get(`resource/${typingName}/`, LabViewModel,
      {resultIsPaginated: true, page: page, pageSize: pageSize});
  }

  public getDatabaseDatasource(typingName: string): LabBiotaDataDatasource {
    return new FlEntityPaginatedDatasource<LabBiotaData>(
      (page: number, pageSize: number): Observable<ClPageI<LabBiotaData>> => this.getDatabaseData(typingName, page, pageSize),
      20, true);
  }


  public searchDatasource(search: LabBiotaDatabaseSearch): LabBiotaDataDatasource {
    return new FlEntityPaginatedDatasource<LabBiotaData>(
      (page: number, pageSize: number): Observable<ClPageI<LabBiotaData>> => this.modelService.search(search, page, pageSize),
      20, true);
  }

}
