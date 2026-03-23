import { inject, Injectable } from '@angular/core';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { TdParamSpecs, TdParamSpecsValues } from '@monorepo/technical-doc';
import { TeRichText } from '@monorepo/text-editor';
import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { LiNavigableEntityImpact } from '../model/entities/li-navigable-entity.entity';
import {
  LiRunningScenarioInfo,
  LiScenario,
  LiScenarioDatasource,
  LiScenarioSimpleForm,
} from '../model/entities/li-scenario.entity';
import { LiScenarioSearch, LiScenarioSearchFields } from '../model/search/li-scenario-search.class';

@Injectable({
  providedIn: 'root',
})
export class LiScenarioService {
  private apiService = inject(FlApiService);

  private route: string = 'scenario';

  public getScenario(id: string): Observable<LiScenario> {
    return this.apiService.get(`${this.route}/${id}`, LiScenario);
  }

  public create(scenario: LiScenarioSimpleForm): Observable<LiScenario> {
    return this.scenarioFormToBody(scenario).pipe(
      switchMap((body: any) => this.apiService.post(this.route, body, LiScenario))
    );
  }

  // update the scenario
  public update(scenarioId: string, scenario: LiScenarioSimpleForm): Observable<LiScenario> {
    return this.scenarioFormToBody(scenario).pipe(
      switchMap((body: any) => this.apiService.put(`${this.route}/${scenarioId}`, body, LiScenario))
    );
  }

  public updateTitle(scenarioId: string, title: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/title`, { title: title }, LiScenario);
  }

  public updateFolder(scenarioId: string, folderId: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/folder`, { folder_id: folderId }, LiScenario);
  }

  private scenarioFormToBody(scenario: LiScenarioSimpleForm): Observable<any> {
    // extract json from file if it exists
    if (scenario.scenarioTemplateJsonFile) {
      return FlFileHelper.readBlobContent(scenario.scenarioTemplateJsonFile, true).pipe(
        map((json: any) => ({
          title: scenario.title,
          folder_id: scenario.folder?.id ?? null,
          scenario_template_id: scenario.scenarioTemplate?.id ?? null,
          scenario_template_json: json,
        }))
      );
    }
    return of({
      title: scenario.title,
      folder_id: scenario.folder?.id ?? null,
      scenario_template_id: scenario.scenarioTemplate?.id ?? null,
    });
  }

  public updateDescription(scenarioId: string, description: TeRichText): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/description`, description.toJson(), LiScenario);
  }

  public syncWithSpace(id: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${id}/sync-with-space`, null, LiScenario);
  }

  // launch a scenario
  public startScenario(scenarioId: string): Observable<LiScenario> {
    return this.apiService.post(`${this.route}/${scenarioId}/start`, null, LiScenario);
  }

  // stop (kill) a scenario
  public stopScenario(scenarioId: string): Observable<LiScenario> {
    return this.apiService.post(`${this.route}/${scenarioId}/stop`, null, LiScenario);
  }

  public resetScenario(scenarioId: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/reset`, null, LiScenario);
  }

  public deleteScenario(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public checkImpactForResetScenario(scenarioId: string): Observable<LiNavigableEntityImpact> {
    return this.apiService.get(`${this.route}/${scenarioId}/reset/check-impact`, LiNavigableEntityImpact);
  }

  public validateScenario(scenarioId: string, folderId: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/validate/${folderId}`, null, LiScenario);
  }

  public cloneScenario(id: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${id}/clone`, null, LiScenario);
  }

  public searchDatasource(): LiScenarioDatasource<LiScenarioSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.advancedSearch(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public advancedSearch(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiScenarioSearchFields>
  ): Observable<ClPageI<LiScenario>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiScenarioSearch.filterConverter,
      LiScenarioSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/advanced-search`, searchInput, LiScenario, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByTitleDatasource(): LiScenarioDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) =>
        this.searchByTitle(page, pageSize, data.filtersCriteria.searchText),
      20,
      { initFirstPage: false }
    );
  }

  public countByTitle(title: string): Observable<{ count: number }> {
    return this.apiService.get(`${this.route}/title/${title}/count`, null, { hideSnackBarError: true });
  }

  public searchByTitle(page: number, pageSize: number, title: string): Observable<ClPageI<LiScenario>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(title)) {
      return this.advancedSearch(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-title/${title}`, LiScenario, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public getRunningScenarios(): Observable<LiRunningScenarioInfo[]> {
    return this.apiService.get(`${this.route}/running`, LiRunningScenarioInfo);
  }

  public getByInputResource(
    resourceId: string,
    page: number,
    pageSize: number
  ): Observable<ClPageI<LiScenario>> {
    return this.apiService.get(`${this.route}/input-resource/${resourceId}`, LiScenario, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }

  ////////////////////////////////////// ARCHIVE //////////////////////////////////////
  public archiveScenario(id: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LiScenario);
  }

  public unarchiveScenario(id: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LiScenario);
  }

  ////////////////////////////////////// INTERMEDIATE RESOURCES //////////////////////////////////////
  public deleteIntermediateResources(scenarioId: string): Observable<any> {
    return this.apiService.delete(`${this.route}/${scenarioId}/intermediate-resources`, null);
  }

  public importScenarioFromLab(configValues: TdParamSpecsValues): Observable<LiScenario> {
    return this.apiService.post(`${this.route}/import-from-lab`, configValues, LiScenario);
  }

  public getImportScenarioConfigSpecs(): Observable<TdParamSpecs> {
    return this.apiService.get(`${this.route}/import-from-lab/config-specs`);
  }

  public exportScenarioToLab(id: string, configValues: TdParamSpecsValues): Observable<LiScenario> {
    return this.apiService.post(`${this.route}/${id}/export-to-lab`, configValues, LiScenario);
  }

  public getExportToLabConfigSpecs(): Observable<TdParamSpecs> {
    return this.apiService.get(`${this.route}/export-to-lab/config-specs`);
  }

  public updateFromExternalLab(scenarioId: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${scenarioId}/update-from-external-lab`, null, LiScenario);
  }
}
