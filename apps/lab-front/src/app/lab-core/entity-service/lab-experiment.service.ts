import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlFileHelper,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {Observable, of, switchMap} from 'rxjs';
import {
  LabExperiment,
  LabExperimentDatasource,
  LabExperimentSimpleForm,
  LabRunningExperimentInfo
} from '../model/entities/lab-experiment.entity';
import {ClHelpService, ClPageI} from '@monorepo/core-lib';
import {
  LabExperimentSearch,
  LabExperimentSearchFields
} from '../entity-module/lab-experiment-core/model/lab-experiment-search.class';
import {map} from 'rxjs/operators';
import {TeRichTextContent} from '@monorepo/text-editor';
import {LabNavigableEntityImpact} from '../model/entities/lab-navigable-entity.entity';


@Injectable({
  providedIn: 'root'
})
export class LabExperimentService {

  private route: string = 'experiment';

  constructor(private apiService: FlApiService) {
  }

  public getExperiment(id: string): Observable<LabExperiment> {
    return this.apiService.get(`${this.route}/${id}`, LabExperiment);
  }

  public create(experiment: LabExperimentSimpleForm): Observable<LabExperiment> {
    return this.experimentFormToBody(experiment).pipe(
      switchMap((body: any) => this.apiService.post(this.route, body, LabExperiment))
    );
  }

  // update the experiment
  public update(experimentId: string, experiment: LabExperimentSimpleForm): Observable<LabExperiment> {
    return this.experimentFormToBody(experiment).pipe(
      switchMap((body: any) => this.apiService.put(`${this.route}/${experimentId}`, body, LabExperiment))
    );
  }

  public updateTitle(experimentId: string, title: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${experimentId}/title`, {title: title}, LabExperiment);
  }

  public updateProject(experimentId: string, projectId: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${experimentId}/project`, {project_id: projectId}, LabExperiment);
  }

  private experimentFormToBody(experiment: LabExperimentSimpleForm): Observable<any> {
    // extract json from file if it exists
    if (experiment.protocolTemplateJsonFile) {
      return FlFileHelper.readBlobContent(experiment.protocolTemplateJsonFile, true).pipe(
        map((json: any) => ({
          title: experiment.title,
          project_id: experiment.project?.id ?? null,
          protocol_template_id: experiment.protocolTemplate?.id ?? null,
          protocol_template_json: json
        })));
    }
    return of({
      title: experiment.title,
      project_id: experiment.project?.id ?? null,
      protocol_template_id: experiment.protocolTemplate?.id ?? null
    });
  }

  public updateDescription(experimentId: string, description: TeRichTextContent): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${experimentId}/description`, description, LabExperiment);
  }

  public syncWithSpace(id: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${id}/sync-with-space`, null, LabExperiment);
  }

  // launch an experiment
  public startExperiment(experimentId: string): Observable<LabExperiment> {
    return this.apiService.post(`${this.route}/${experimentId}/start`, null, LabExperiment);
  }

  // stop (kill) an experiment
  public stopExperiment(experimentId: string): Observable<LabExperiment> {
    return this.apiService.post(`${this.route}/${experimentId}/stop`, null, LabExperiment);
  }

  public resetExperiment(experimentId: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${experimentId}/reset`, null, LabExperiment);
  }

  public deleteExperiment(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public checkImpactForResetExperiment(experimentId: string): Observable<LabNavigableEntityImpact> {
    return this.apiService.get(`${this.route}/${experimentId}/reset/check-impact`, LabNavigableEntityImpact);
  }

  public validateExperiment(experimentId: string, projectId: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${experimentId}/validate/${projectId}`, null, LabExperiment);
  }

  public cloneExperiment(id: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${id}/clone`, null, LabExperiment);
  }


  public searchDatasource(): LabExperimentDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, filters?: LabExperimentSearchFields) => this.advancedSearch(page, pageSize, filters),
      20, false
    );
  }

  public advancedSearch(page: number, pageSize: number, filters?: LabExperimentSearchFields): Observable<ClPageI<LabExperiment>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabExperimentSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/advanced-search`, data, LabExperiment, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByTitleDatasource(): LabExperimentDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, name: string) => this.searchByTitle(page, pageSize, name),
      20, false
    );
  }

  public countByTitle(title: string): Observable<{ count: number }> {
    return this.apiService.get(`${this.route}/title/${title}/count`, null,
      {hideSnackBarError: true});
  }

  public searchByTitle(page: number, pageSize: number, title: string): Observable<ClPageI<LabExperiment>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(title)) {
      return this.advancedSearch(page, pageSize);
    }
    return this.apiService.get(`${this.route}/search-title/${title}`, LabExperiment, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public getRunningExperiments(): Observable<LabRunningExperimentInfo[]> {
    return this.apiService.get(`${this.route}/running`, LabRunningExperimentInfo);
  }

  public getByInputResource(resourceId: string, page: number, pageSize: number): Observable<ClPageI<LabExperiment>> {
    return this.apiService.get(`${this.route}/input-resource/${resourceId}`, LabExperiment,
      {resultIsPaginated: true, page: page, pageSize: pageSize});
  }

  ////////////////////////////////////// ARCHIVE //////////////////////////////////////
  public archiveExperiment(id: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LabExperiment);
  }

  public unarchiveExperiment(id: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LabExperiment);
  }
}
