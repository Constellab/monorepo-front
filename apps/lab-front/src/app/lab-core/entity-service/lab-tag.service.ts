import {Injectable} from '@angular/core';
import {FlApiService, FlTagDatasource, FlTagService, FlTagValue} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {LabEntityTagType, LabTag, LabTagEntity} from '../model/entities/lab-tag.entity';


@Injectable({
  providedIn: 'root'
})
export class LabTagService extends FlTagService {

  private readonly route: string = 'tag';

  constructor(private apiService: FlApiService) {
    super();
  }

  public searchTag(key: string): Observable<LabTagEntity[]> {
    if (!key) return this.getAllTags();
    return this.apiService.get(`${this.route}/${key}`, LabTagEntity);
  }

  public getAllTags(): Observable<LabTagEntity[]> {
    return this.apiService.get(this.route, LabTagEntity);
  }

  public createTag(tagKey: string, tagValue: FlTagValue): Observable<LabTagEntity> {
    return this.apiService.post(`${this.route}/${tagKey}/${tagValue}`, LabTagEntity);
  }

  public updateTag(tagKey: string, oldTagValue: FlTagValue, newTagValue: FlTagValue): Observable<LabTagEntity> {
    return this.apiService.put(`${this.route}/${tagKey}/${oldTagValue}/${newTagValue}`, LabTagEntity);
  }

  public deleteTag(tagKey: string, tagValue: FlTagValue): Observable<void> {
    return this.apiService.delete(`${this.route}/${tagKey}/${tagValue}`);
  }

  public reorderTags(tagKeys: string[]): Observable<LabTagEntity[]> {
    return this.apiService.put(`${this.route}/reorder`, tagKeys, LabTagEntity);
  }

  public reorderTagValues(tagKey: string, values: FlTagValue[]): Observable<LabTagEntity> {
    return this.apiService.put(`${this.route}/${tagKey}/reorder`, values, LabTagEntity);
  }

  ///////////////////////////////////////////////////// ENTITY TAGS /////////////////////////////////////////////////////

  public getEntityTags(entityType: LabEntityTagType, entityId: string): Observable<LabTag[]> {
    return this.apiService.get(`${this.route}/entity/${entityType}/${entityId}`, LabTag);
  }

  public getEntityTagsDatasource(entityType: LabEntityTagType, entityId: string): FlTagDatasource {
    return new FlTagDatasource(this.getEntityTags(entityType, entityId));
  }

  public saveEntityTags(entityType: LabEntityTagType, entityId: string,
                        tags: LabTag[]): Observable<LabTag[]> {
    return this.apiService.put(`${this.route}/entity/${entityType}/${entityId}`, tags, LabTag);
  }
}
