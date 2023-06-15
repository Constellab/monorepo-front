import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {
  LabCredentials,
  LabCredentialsData,
  LabCredentialsDatasource,
  LabSaveCredentialsDTO
} from '../model/entities/lab-credentials.entity';
import {CmCredentials} from '@monorepo/common-model';
import {ClPageI} from '@monorepo/core-lib';
import {
  LabCredentialsSearch,
  LabCredentialsSearchFields
} from '../entity-module/lab-credentials-core/component/lab-select-credentials-dynamic-field/lab-credentials-search.class';

@Injectable({
  providedIn: 'root'
})
export class LabCredentialsService {

  private readonly route: string = 'credentials';


  constructor(private apiService: FlApiService) {
  }

  public create(credentials: LabSaveCredentialsDTO): Observable<LabCredentials> {
    return this.apiService.post(this.route, credentials, LabCredentials);
  }

  public update(id: string, credentials: LabSaveCredentialsDTO): Observable<LabCredentials> {
    return this.apiService.put(`${this.route}/${id}`, credentials, LabCredentials);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public findById(id: string): Observable<LabCredentials> {
    return this.apiService.get(`${this.route}/${id}`, LabCredentials);
  }

  public getCredentialsData(id: string, userCredentials: CmCredentials): Observable<LabCredentialsData> {
    return this.apiService.post(`${this.route}/${id}/data`, userCredentials);
  }

  public findByName(name: string): Observable<LabCredentials | null> {
    return this.apiService.get(`${this.route}/name/${name}`, LabCredentials);
  }

  public getAll(page: number, pageSize: number): Observable<ClPageI<LabCredentials>> {
    return this.apiService.get(this.route, LabCredentials, {resultIsPaginated: true, page, pageSize});
  }

  public getAllDatasource(): LabCredentialsDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAll(page, size), 20, true);
  }

  public search(page: number, pageSize: number, filters?: LabCredentialsSearchFields): Observable<ClPageI<LabCredentials>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabCredentialsSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search`, data, LabCredentials, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

}
