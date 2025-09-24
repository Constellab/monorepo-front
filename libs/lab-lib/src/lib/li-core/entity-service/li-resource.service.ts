import { inject, Injectable } from '@angular/core';
import { ClDateHelper, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter, FlSearchFunction } from '@monorepo/front-core-lib/fl-search';
import { TdParamSpecs, TdParamSpecsValues } from '@monorepo/technical-doc';
import { DateTime } from 'luxon';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { LiFolder } from '../model/entities/li-folder.class';
import { LiNavigableEntityImpact } from '../model/entities/li-navigable-entity.entity';
import { LiSharedEntity, LiShareLink } from '../model/entities/li-share.entity';
import { LiProcessType } from '../model/entities/li-type/li-process-type.entity';
import { LiResource } from '../model/entities/resource/li-resource.entity';
import {
  LiResourceView,
  LiResourceViewData,
  LiResourceViewSpec,
} from '../model/entities/resource/li-resource-view.entity';
import { LiTransformerParams } from '../model/global/li-transformer.class';
import { LiResourceSearch, LiResourceSearchFields } from '../model/search/li-resource-search.class';

@Injectable({
  providedIn: 'root',
})
export class LiResourceService {
  private apiService = inject(FlApiService);

  public static readonly defaultViewName: string = 'default-view';
  private readonly route: string = 'resource';
  private readonly resourceTypeRoute: string = 'resource-type';

  //////////////////////////////////////// RESOURCE ///////////////////////////////////////

  public getById(id: string): Observable<LiResource> {
    if (!id) {
      return of(null);
    }

    // get the resource in the correct type
    return this.apiService.get(`${this.route}/${id}`, LiResource);
  }

  public getResourceChildren(id: string): Observable<LiResource[]> {
    // get the resource in the correct type
    return this.apiService.get(`${this.route}/${id}/children`, LiResource);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public checkImpactForDeleteResource(id: string): Observable<LiNavigableEntityImpact> {
    return this.apiService.get(`${this.route}/${id}/delete/check-impact`, LiNavigableEntityImpact);
  }

  public updateName(id: string, name: string): Observable<LiResource> {
    return this.apiService.put(`${this.route}/${id}/name/${name}`, null, LiResource);
  }

  public updateResourceType(id: string, resourceTypingName: string): Observable<LiResource> {
    return this.apiService.put(`${this.route}/${id}/type/${resourceTypingName}`, null, LiResource);
  }

  public searchByName(name: string, page: number, pageSize: number): Observable<ClPageI<LiResource>> {
    return this.apiService.get(`${this.route}/search-name/${name}`, LiResource, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public getAdvancedSearchFunction(): FlSearchFunction<LiResource> {
    return (page: number, pageSize: number, data) => this.advancedSearch(page, pageSize, data);
  }

  public advancedSearch(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiResourceSearchFields>
  ): Observable<ClPageI<LiResource>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiResourceSearch.filterConverter,
      LiResourceSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/advanced-search`, searchInput, LiResource, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public appSearch(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiResourceSearchFields>
  ): Observable<ClPageI<LiResource>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiResourceSearch.filterConverter,
      LiResourceSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search-app`, searchInput, LiResource, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public updateFlagged(id: string, flagged: boolean): Observable<LiResource> {
    return this.apiService.put(`${this.route}/${id}/flagged`, { flagged: flagged }, LiResource);
  }

  public updateFolder(id: string, folderId: string): Observable<LiResource> {
    return this.apiService.put(`${this.route}/${id}/folder`, { folder_id: folderId }, LiResource);
  }

  //////////////////////////////////////// RESOURCE TYPE ///////////////////////////////////////

  // get the view specs for a resource type
  public getResourceTypeViewSpecsDetail(
    resourceTypingName: string,
    viewName: string
  ): Observable<LiResourceViewSpec> {
    return this.apiService.get(
      `${this.resourceTypeRoute}/${resourceTypingName}/views/${viewName}/specs`,
      LiResourceViewSpec
    );
  }

  public getResourceViewsList(resourceTypingName: string): Observable<LiResourceViewSpec[]> {
    return this.apiService
      .get(`${this.resourceTypeRoute}/${resourceTypingName}/views`, LiResourceViewSpec)
      .pipe(map((views: LiResourceViewSpec[]) => views.sort((view) => (view.defaultView ? -1 : 1))));
  }

  //////////////////////////////////////// RESOURCE VIEWS  ///////////////////////////////////////

  // get the view specs for a resource
  public getResourceViewSpecsDetail(id: string, viewName: string): Observable<LiResourceViewSpec> {
    return this.apiService.get(`${this.route}/${id}/views/${viewName}/specs`, LiResourceViewSpec);
  }

  /**
   * Call a view on a resource
   * @param id
   * @param viewMethodName
   * @param config
   * @param saveViewConfig if true the config is saved in the historic
   */
  public callResourceViewData(
    id: string,
    viewMethodName: string,
    config: TdParamSpecsValues,
    saveViewConfig: boolean = false
  ): Observable<LiResourceViewData> {
    return this.callResourceView(id, viewMethodName, config, saveViewConfig).pipe(
      map((labView) => labView.view)
    );
  }

  public callResourceView(
    id: string,
    viewMethodName: string,
    configValue: TdParamSpecsValues,
    saveViewConfig: boolean = false
  ): Observable<LiResourceView> {
    for (const key in configValue) {
      if (configValue[key] == null) {
        delete configValue[key];
      }
    }
    return this.apiService.post(
      `${this.route}/${id}/views/${viewMethodName}`,
      {
        values: configValue,
        save_view_config: saveViewConfig,
      },
      LiResourceView
    );
  }

  public callResourceDefaultView(id: string, saveViewConfig: boolean = false): Observable<LiResourceView> {
    return this.callResourceView(id, LiResourceService.defaultViewName, {}, saveViewConfig);
  }

  public downloadResourceViewJsonFile(
    id: string,
    viewMethodName: string,
    configValue: TdParamSpecsValues,
    saveViewConfig: boolean = false
  ): Observable<Blob> {
    for (const key in configValue) {
      if (configValue[key] == null) {
        delete configValue[key];
      }
    }
    return this.apiService.downloadFilePost(
      `${this.route}/${id}/views/${viewMethodName}/json-file`,
      {
        values: configValue,
        save_view_config: saveViewConfig,
      },
      'resource_view.json'
    );
  }

  //////////////////////////////////////// TRANSFORMERS  ///////////////////////////////////////
  /**
   * Create a scenario for a resource, with a list of transformers
   * @param transformers
   * @param resourceId
   */
  public transformResource(transformers: LiTransformerParams[], resourceId: string): Observable<LiResource> {
    return this.apiService.post(`${this.route}/${resourceId}/transform`, transformers, LiResource);
  }

  //////////////////////////////////////// IMPORTER  ///////////////////////////////////////

  public callImporter(
    resourceId: string,
    importerType: string,
    config: TdParamSpecsValues
  ): Observable<LiResource> {
    return this.apiService.post(`${this.route}/${resourceId}/import/${importerType}`, config, LiResource);
  }

  //////////////////////////////////////// EXPORTER  ///////////////////////////////////////

  public getResourceExporterConfig(resourceTypingName: string): Observable<LiProcessType> {
    return this.apiService.get(`${this.route}/${resourceTypingName}/exporter`, LiProcessType);
  }

  public exportResource(
    resourceId: string,
    exporterTypingName: string,
    config: TdParamSpecsValues
  ): Observable<LiResource> {
    return this.apiService.post(
      `${this.route}/${resourceId}/export/${exporterTypingName}`,
      config,
      LiResource
    );
  }

  //////////////////////////////////////// SHARED RESOURCE ///////////////////////////////////////
  public getSharedResourceOrigin(id: string): Observable<LiSharedEntity> {
    return this.apiService.get(`${this.route}/${id}/shared-origin`, LiSharedEntity);
  }

  public importResourceFromLink(configValues: TdParamSpecsValues): Observable<LiResource> {
    return this.apiService.post(`${this.route}/import-from-link`, configValues, LiResource);
  }

  public getImportResourceConfigSpecs(): Observable<TdParamSpecs> {
    return this.apiService.get(`${this.route}/import-from-link/config-specs`);
  }

  public exportResourceToLab(id: string, configValues: TdParamSpecsValues): Observable<LiResource> {
    return this.apiService.post(`${this.route}/${id}/export-to-lab`, configValues, LiResource);
  }

  public getExportToLabConfigSpecs(): Observable<TdParamSpecs> {
    return this.apiService.get(`${this.route}/export-to-lab/config-specs`);
  }

  public shareWithSpace(
    resourceId: string,
    shareInfo: {
      folder: LiFolder;
      validUntil?: DateTime;
    }
  ): Observable<LiShareLink> {
    const requestDTO = {
      folder_id: shareInfo.folder.id,
      valid_until: ClDateHelper.serializeDate(shareInfo.validUntil),
    };
    return this.apiService.post(`${this.route}/${resourceId}/share-with-space`, requestDTO, LiShareLink);
  }
}
