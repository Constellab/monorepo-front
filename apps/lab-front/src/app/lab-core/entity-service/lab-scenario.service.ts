import { Injectable } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFileHelper,
  FlInputSearchFilter,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import { Observable, of, switchMap } from 'rxjs';
import {
  LabRunningScenarioInfo,
  LabScenario,
  LabScenarioDatasource,
  LabScenarioSimpleForm
} from '../model/entities/lab-scenario.entity';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import {
  LabScenarioSearch,
  LabScenarioSearchFields
} from '../entity-module/lab-scenario-core/model/lab-scenario-search.class';
import { map } from 'rxjs/operators';
import { TeRichTextContent } from '@monorepo/text-editor';
import { LabNavigableEntityImpact } from '../model/entities/lab-navigable-entity.entity';
import { LabResource } from '../model/entities/resource/lab-resource.entity';


@Injectable({
  providedIn: 'root'
})
export class LabScenarioService {

  private route: string = 'scenario';

  constructor(private apiService: FlApiService) {
  }

  public getScenario(id: string): Observable<LabScenario> {
    return this.apiService.get(`${this.route}/${id}`, LabScenario);
  }

  public create(scenario: LabScenarioSimpleForm): Observable<LabScenario> {
    return this.scenarioFormToBody(scenario).pipe(
      switchMap((body: any) => this.apiService.post(this.route, body, LabScenario))
    );
  }

  // update the scenario
  public update(scenarioId: string, scenario: LabScenarioSimpleForm): Observable<LabScenario> {
    return this.scenarioFormToBody(scenario).pipe(
      switchMap((body: any) => this.apiService.put(`${this.route}/${scenarioId}`, body, LabScenario))
    );
  }

  public updateTitle(scenarioId: string, title: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/title`, { title: title }, LabScenario);
  }

  public updateFolder(scenarioId: string, folderId: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/folder`, { folder_id: folderId }, LabScenario);
  }

  private scenarioFormToBody(scenario: LabScenarioSimpleForm): Observable<any> {
    // extract json from file if it exists
    if (scenario.protocolTemplateJsonFile) {
      return FlFileHelper.readBlobContent(scenario.protocolTemplateJsonFile, true).pipe(
        map((json: any) => ({
          title: scenario.title,
          folder_id: scenario.folder?.id ?? null,
          protocol_template_id: scenario.protocolTemplate?.id ?? null,
          protocol_template_json: json
        })));
    }
    return of({
      title: scenario.title,
      folder_id: scenario.folder?.id ?? null,
      protocol_template_id: scenario.protocolTemplate?.id ?? null
    });
  }

  public updateDescription(scenarioId: string, description: TeRichTextContent): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/description`, description, LabScenario);
  }

  public syncWithSpace(id: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${id}/sync-with-space`, null, LabScenario);
  }

  // launch an scenario
  public startScenario(scenarioId: string): Observable<LabScenario> {
    return this.apiService.post(`${this.route}/${scenarioId}/start`, null, LabScenario);
  }

  // stop (kill) an scenario
  public stopScenario(scenarioId: string): Observable<LabScenario> {
    return this.apiService.post(`${this.route}/${scenarioId}/stop`, null, LabScenario);
  }

  public resetScenario(scenarioId: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/reset`, null, LabScenario);
  }

  public deleteScenario(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public checkImpactForResetScenario(scenarioId: string): Observable<LabNavigableEntityImpact> {
    return this.apiService.get(`${this.route}/${scenarioId}/reset/check-impact`, LabNavigableEntityImpact);
  }

  public validateScenario(scenarioId: string, folderId: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/validate/${folderId}`, null, LabScenario);
  }

  public cloneScenario(id: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${id}/clone`, null, LabScenario);
  }

  public searchDatasource(): LabScenarioDatasource<LabScenarioSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.advancedSearch(page, pageSize, data),
      20, false
    );
  }


  public advancedSearch(page: number, pageSize: number,
                        data: FlDatasourceGetPageData<LabScenarioSearchFields>): Observable<ClPageI<LabScenario>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data, LabScenarioSearch.filterConverter,
      LabScenarioSearch.sortConverter);
    return this.apiService.post(`${this.route}/advanced-search`, searchInput, LabScenario, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByTitleDatasource(): LabScenarioDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.searchByTitle(page, pageSize, data.filtersCriteria.searchText),
      20, false
    );
  }

  public countByTitle(title: string): Observable<{ count: number }> {
    return this.apiService.get(`${this.route}/title/${title}/count`, null,
      { hideSnackBarError: true });
  }

  public searchByTitle(page: number, pageSize: number, title: string): Observable<ClPageI<LabScenario>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(title)) {
      return this.advancedSearch(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-title/${title}`, LabScenario, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public getRunningScenarios(): Observable<LabRunningScenarioInfo[]> {
    return this.apiService.get(`${this.route}/running`, LabRunningScenarioInfo);
  }

  public getByInputResource(resourceId: string, page: number, pageSize: number): Observable<ClPageI<LabScenario>> {
    return this.apiService.get(`${this.route}/input-resource/${resourceId}`, LabScenario,
      { resultIsPaginated: true, page: page, pageSize: pageSize });
  }

  ////////////////////////////////////// ARCHIVE //////////////////////////////////////
  public archiveScenario(id: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LabScenario);
  }

  public unarchiveScenario(id: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LabScenario);
  }

  ////////////////////////////////////// INTERMEDIATE RESOURCES //////////////////////////////////////
  public deleteIntermediateResources(scenarioId: string): Observable<any> {
    return this.apiService.delete(`${this.route}/${scenarioId}/intermediate-resources`, null);
  }

  public importScenarioFromLab(url: string, mode: string): Observable<LabScenario> {
    return this.apiService.post(`${this.route}/import-from-lab`,
      { url: url, mode: mode }, LabResource);
  }
}
