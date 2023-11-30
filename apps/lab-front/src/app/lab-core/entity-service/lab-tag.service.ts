import {Injectable} from '@angular/core';
import {FlApiService, FlTag, FlTagService, FlTagValue} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {
  LabCreateTagResponse,
  LabEntityTagType,
  LabTag,
  LabTagDatasource,
  LabTagDetail,
  LabTagKeyModel,
  LabTagValueModel,
  TagPropagationImpactDTO
} from '../model/entities/lab-tag.entity';
import {ClPageI} from '@monorepo/core-lib';


@Injectable({
  providedIn: 'root'
})
export class LabTagService extends FlTagService {

  private readonly route: string = 'tag';

  constructor(private apiService: FlApiService) {
    super();
  }

  public searchKeys(key: string, page: number, pageSize: number): Observable<ClPageI<LabTagKeyModel>> {
    const strKey = key ? '/' + key : '';
    return this.apiService.get(`${this.route}/search/key${strKey}`, LabTagKeyModel, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true
    });
  }


  public searchValues(key: string, value: FlTagValue, page: number, pageSize: number): Observable<ClPageI<LabTagValueModel>> {
    const strValue = value ? '/' + value : '';
    return this.apiService.get(`${this.route}/search/key/${key}/value${strValue}`, LabTagValueModel, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true
    });
  }


  searchTag(filters: { key: string; value?: string },
            page: number, pageSize: number): Observable<ClPageI<any>> {
    if (filters.value == null) {
      return this.searchKeys(filters.key, page, pageSize);
    } else {
      return this.searchValues(filters.key, filters.value, page, pageSize) as any;
    }
  }


  public getAllTags(): Observable<LabTagKeyModel[]> {
    return this.apiService.get(this.route, LabTagKeyModel);
  }

  public createTag(tagKey: string, tagValue: FlTagValue): Observable<LabCreateTagResponse> {
    return this.apiService.post(`${this.route}/${tagKey}/${tagValue}`, null, LabCreateTagResponse);
  }

  public updateTag(tagKey: string, oldTagValue: FlTagValue, newTagValue: FlTagValue): Observable<LabCreateTagResponse> {
    return this.apiService.put(`${this.route}/${tagKey}/${oldTagValue}/${newTagValue}`, null, LabCreateTagResponse);
  }

  public deleteTag(tagKey: string, tagValue: FlTagValue): Observable<void> {
    return this.apiService.delete(`${this.route}/${tagKey}/${tagValue}`);
  }

  public reorderTags(tagKeys: string[]): Observable<LabTagKeyModel[]> {
    return this.apiService.put(`${this.route}/reorder`, tagKeys, LabTagKeyModel);
  }

  ///////////////////////////////////////////////////// ENTITY TAGS /////////////////////////////////////////////////////


  addEntityTags(entityType: string, entityId: string, tags: FlTag[],
                propagate: boolean): Observable<LabTag[]> {
    return this.apiService.post(`${this.route}/entity/${entityType}/${entityId}/${propagate}`, tags, LabTag);
  }

  deleteEntityTag(entityType: string, entityId: string, tag: FlTag): Observable<void> {
    return this.apiService.delete(`${this.route}/entity/${entityType}/${entityId}/${tag.key}/${tag.value}`);
  }

  public getEntityTags(entityType: LabEntityTagType, entityId: string): Observable<LabTag[]> {
    return this.apiService.get(`${this.route}/entity/${entityType}/${entityId}`, LabTag);
  }

  public getEntityTagsDatasource(entityType: LabEntityTagType, entityId: string): LabTagDatasource {
    return new LabTagDatasource(this.getEntityTags(entityType, entityId));
  }

  public getEntityTag(entityTagId: string): Observable<LabTagDetail> {
    return this.apiService.get(`${this.route}/entity/${entityTagId}`, LabTagDetail);
  }


  ////////////////////////////////////////////////// PROPAGATION //////////////////////////////////////////////////
  public checkPropagationAddTags(entityType: LabEntityTagType, entityId: string, tags: FlTag[]): Observable<TagPropagationImpactDTO> {
    return this.apiService.post(`${this.route}/check-propagation-add/${entityType}/${entityId}`, tags, TagPropagationImpactDTO);
  }

  public checkPropagationDeleteTags(entityType: LabEntityTagType, entityId: string, tag: FlTag): Observable<TagPropagationImpactDTO> {
    return this.apiService.post(`${this.route}/check-propagation-delete/${entityType}/${entityId}`, tag, TagPropagationImpactDTO);
  }

}
