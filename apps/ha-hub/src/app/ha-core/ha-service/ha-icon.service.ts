import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {ClPage} from '@monorepo/core-lib';
import {HaIcon, HaIconCreateDto, HaIconDatasourcePaginated} from '../ha-model/ha-entities/ha-icon.class';

@Injectable({
  providedIn: 'root'
})
export class HaIconService {
  private readonly route: string = 'icon';

  constructor(private apiService: FlApiService) {

  }

  public getAllPaginated(): HaIconDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAll(page, size), 10);
  }

  public getAllPaginatedFiltered(subNameFilter: string): HaIconDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllByFilter(subNameFilter, page, size), 10);
  }

  private getAll(page: number, size: number): Observable<ClPage<HaIcon>> {
    return this.apiService.get(this.route, HaIcon, {page: page, pageSize: size, resultIsPaginated: true});
  }

  private getAllByFilter(subNameFilter: string, page: number, size: number): Observable<ClPage<HaIcon>> {
    return this.apiService.post(this.route + '/filter', {subNameFilter: subNameFilter}, HaIcon, {
      page: page,
      pageSize: size,
      resultIsPaginated: true
    });
  }

  public getById(id: string): Observable<HaIcon> {
    return this.apiService.getById(this.route, id, HaIcon);
  }

  public getByTechnicalName(technicalName: string): Observable<HaIcon> {
    return this.apiService.get(this.route + '/technical-name/' + technicalName, HaIcon);
  }

  public getFile(technicalName: string): Observable<any> {
    return this.apiService.get(this.route + '/file/' + technicalName);
  }

  public create(icon: HaIconCreateDto, file: File): Observable<HaIcon>{
    const formData = new FormData();
    formData.append('icon', JSON.stringify(icon));
    formData.append('file', file);
    return this.apiService.post(this.route, formData);
  }

  public update(icon: HaIconCreateDto, file: File): Observable<HaIcon>{
    const formData = new FormData();
    formData.append('icon', JSON.stringify(icon));
    formData.append('file', file);
    return this.apiService.put(this.route, formData);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(this.route + '/' + id);
  }

}
