import { inject, Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { Observable } from 'rxjs';

import {
  LiCreateFormDTO,
  LiForm,
  LiFormContent,
  LiSaveFormDTO,
  LiUpdateFormDTO,
} from '../../li-core/model/entities/form/li-form.entity';
import { LiFormSaveEvent } from '../../li-core/model/entities/form/li-form-save-event.entity';
import { LiFormSearch, LiFormSearchFields } from './li-form-search';

export type LiFormDatasource<F = void> = FlEntityPaginatedDatasource<LiForm, F>;

@Injectable({
  providedIn: 'root',
})
export class LiFormService {
  private apiService = inject(FlApiService);

  private readonly route = 'form';

  public create(dto: LiCreateFormDTO): Observable<LiForm> {
    return this.apiService.post(this.route, dto, LiForm);
  }

  public getById(id: string): Observable<LiForm> {
    return this.apiService.get(`${this.route}/${id}`, LiForm);
  }

  public getContent(id: string): Observable<LiFormContent> {
    return this.apiService.get(`${this.route}/${id}/content`, LiFormContent);
  }

  public update(id: string, dto: LiUpdateFormDTO): Observable<LiForm> {
    return this.apiService.put(`${this.route}/${id}`, dto, LiForm);
  }

  public save(id: string, dto: LiSaveFormDTO): Observable<LiFormContent> {
    return this.apiService.post(`${this.route}/${id}/save`, dto, LiFormContent);
  }

  public fillFromText(
    id: string,
    text: string,
    currentValues?: Record<string, unknown>
  ): Observable<LiFormContent> {
    return this.apiService.post(
      `${this.route}/${id}/fill-from-text`,
      { text, current_values: currentValues ?? {} },
      LiFormContent
    );
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiFormSearchFields>
  ): Observable<ClPageI<LiForm>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiFormSearch.filterConverter,
      LiFormSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiForm, {
      page,
      pageSize,
      resultIsPaginated: true,
    });
  }

  public searchDatasource(): LiFormDatasource<LiFormSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public archive(id: string): Observable<LiForm> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LiForm);
  }

  public unarchive(id: string): Observable<LiForm> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LiForm);
  }

  public getHistory(id: string, page: number, pageSize: number): Observable<ClPageI<LiFormSaveEvent>> {
    return this.apiService.get(`${this.route}/${id}/history`, LiFormSaveEvent, {
      page,
      pageSize,
      resultIsPaginated: true,
    });
  }
}
