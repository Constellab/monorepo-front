import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlSearchConverter,
} from '@monorepo/front-core-lib';
import {LabReport, LabReportContent, LabReportDatasource, LabReportForm} from '../model/entities/lab-report.entity';
import {Observable} from 'rxjs';
import {ClHelpService, ClPageI} from '@monorepo/core-lib';
import {LabExperiment} from '../model/entities/lab-experiment.entity';
import {LabReportSearch, LabReportSearchFields} from '../entity-module/lab-report-core/model/lab-report-search.class';
import {map} from 'rxjs/operators';
import {TeRichText, TeUploadedImage} from '@monorepo/text-editor';

@Injectable({providedIn: 'root'})
export class LabReportService {

  private route: string = 'report';

  constructor(private apiService: FlApiService,
              private dialogService: FlDialogService) {
  }

  public create(report: LabReportForm): Observable<LabReport> {
    return this.apiService.post(this.route, this.reportFormToBody(report), LabReport);
  }

  public createForExperiment(report: LabReportForm, experimentId: string): Observable<LabReport> {
    return this.apiService.post(`${this.route}/experiment/${experimentId}`, this.reportFormToBody(report), LabReport);
  }

  public update(id: string, report: LabReportForm): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${id}`, this.reportFormToBody(report), LabReport);
  }

  public updateTitle(id: string, title: string): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${id}/title`, {title: title}, LabReport);
  }

  public updateProject(id: string, projectId: string): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${id}/project`, {project_id: projectId}, LabReport);
  }

  private reportFormToBody(report: LabReportForm): any {
    return {
      title: report.title,
      project_id: report.project?.id ?? null,
      template_id: report.template?.id ?? null
    };
  }

  public updateContent(id: string, content: LabReportContent): Observable<LabReportContent> {
    if (content == null) {
      content = TeRichText.emptyContent();
    }
    return this.apiService.put(`${this.route}/${id}/content`, content);
  }

  public addViewToContent(id: string, viewConfigId: string): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${id}/content/add-view/${viewConfigId}`, null, LabReport);
  }

  public syncWithSpace(id: string): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${id}/sync-with-space`, null, LabReport);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public addExperiment(reportId: string, experimentId: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${reportId}/add-experiment/${experimentId}`, null, LabExperiment);
  }

  public removeExperiment(reportId: string, experimentId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${reportId}/remove-experiment/${experimentId}`, null);
  }

  public removeExperimentWithConfirmation(reportId: string, experimentId: string): Observable<FlConfirmDialogResult<void>> {
    const input: FlConfirmDialogInput = {
      title: 'biox.report_unlink_experiment',
      content: 'biox.report_unlink_experiment_confirmation',
      translateTitleAndContent: true,
      observable: this.removeExperiment(reportId, experimentId),
      successMessage: 'biox.report_experiment_unlinked',
      translateMessage: true
    };

    return this.dialogService.openConfirmDialog(input).afterClosed();
  }

  public validate(reportId: string, projectId: string): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${reportId}/validate/${projectId}`, null, LabReport);
  }

  ///////////////////////////////////////////// GET /////////////////////////////////////////////

  public getReport(id: string): Observable<LabReport> {
    return this.apiService.getById(this.route, id, LabReport);
  }

  public getReportContent(id: string): Observable<LabReportContent> {
    return this.apiService.get(`${this.route}/${id}/content`);
  }

  public getByExperiment(experimentId: string): Observable<LabReport[]> {
    return this.apiService.get(`${this.route}/experiment/${experimentId}`, LabReport);
  }

  public getExperimentByReports(reportId: string): Observable<LabExperiment[]> {
    return this.apiService.get(`${this.route}/${reportId}/experiments`, LabExperiment);
  }


  public getSearchDatasource(): LabReportDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, filters?: LabReportSearchFields) => this.search(page, pageSize, filters),
      20, false
    );
  }

  public search(page: number, pageSize: number,
                filters?: LabReportSearchFields): Observable<ClPageI<LabReport>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabReportSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search`, data, LabReport, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNameDatasource(): LabReportDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, name: string) => this.searchByName(page, pageSize, name),
      20, false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabReport>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabReport, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public getByResource(resourceId: string, page: number, pageSize: number): Observable<ClPageI<LabReport>> {
    return this.apiService.get(`${this.route}/resource/${resourceId}`, LabReport,
      {resultIsPaginated: true, page: page, pageSize: pageSize});
  }

  ///////////////////////////////////////////// IMAGE /////////////////////////////////////////////


  public getFilePath(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  uploadImage(file: File): Observable<TeUploadedImage> {
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

  ///////////////////////////////////////////// ARCHIVE /////////////////////////////////////////////
  public archive(id: string): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LabReport);
  }

  public unarchive(id: string): Observable<LabReport> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LabReport);
  }

}
