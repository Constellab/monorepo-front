import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlSearchConverter,
  FlTextEditorUploadedImage
} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {ClHelpService, ClPageI} from '@monorepo/core-lib';
import {LabReportSearch, LabReportSearchFields} from '../entity-module/lab-report-core/model/lab-report-search.class';
import {map} from 'rxjs/operators';
import {
  LabReportTemplate,
  LabReportTemplateDatasource,
  LabReportTemplateForm
} from '../model/entities/lab-report-template.entity';
import {TeTextEditorContent, TeTextEditorHelper} from '@monorepo/text-editor';

@Injectable({providedIn: 'root'})
export class LabReportTemplateService {

  private route: string = 'report-template';

  constructor(private apiService: FlApiService) {
  }

  public createEmpty(data: LabReportTemplateForm): Observable<LabReportTemplate> {
    return this.apiService.post(this.route, data, LabReportTemplate);
  }

  public createFromReport(reportId: string): Observable<LabReportTemplate> {
    return this.apiService.post(`${this.route}/from-report`, {report_id: reportId}, LabReportTemplate);
  }


  public updateTitle(id: string, title: string): Observable<LabReportTemplate> {
    return this.apiService.put(`${this.route}/${id}/title`, {title: title}, LabReportTemplate);
  }


  public updateContent(id: string, content: TeTextEditorContent): Observable<LabReportTemplate> {
    if (content == null) {
      content = TeTextEditorHelper.emptyContent();
    }
    return this.apiService.put(`${this.route}/${id}/content`, content, LabReportTemplate);
  }


  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }


  ///////////////////////////////////////////// GET /////////////////////////////////////////////

  public getReportTemplate(id: string): Observable<LabReportTemplate> {
    return this.apiService.getById(this.route, id, LabReportTemplate);
  }

  public getSearchDatasource(): LabReportTemplateDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, filters?: LabReportSearchFields) => this.search(page, pageSize, filters),
      20, false
    );
  }

  public search(page: number, pageSize: number,
                filters?: LabReportSearchFields): Observable<ClPageI<LabReportTemplate>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabReportSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search`, data, LabReportTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNameDatasource(): LabReportTemplateDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, name: string) => this.searchByName(page, pageSize, name),
      20, false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabReportTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabReportTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public getByResource(resourceId: string, page: number, pageSize: number): Observable<ClPageI<LabReportTemplate>> {
    return this.apiService.get(`${this.route}/resource/${resourceId}`, LabReportTemplate,
      {resultIsPaginated: true, page: page, pageSize: pageSize});
  }

  ///////////////////////////////////////////// IMAGE /////////////////////////////////////////////


  public getFilePath(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  uploadImage(file: File): Observable<FlTextEditorUploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    return this.apiService.post(`${this.route}/image`, formData).pipe(
      map(
        (uploadedFile: any) => {
          return {
            filename: uploadedFile.filename,
            width: uploadedFile.width,
            height: uploadedFile.height,
          };
        }
      )
    );
  }

  getImageUrl(filename: string): string {
    return this.getFilePath(filename);
  }

}
