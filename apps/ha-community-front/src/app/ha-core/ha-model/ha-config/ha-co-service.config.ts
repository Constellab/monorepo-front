import { inject, Injectable } from '@angular/core';
import { CoConfig } from '@monorepo/community-lib';
import { HaEnvironmentHelper } from './ha-environment.helper';
import { HaTagService } from '../../ha-service/ha-tag.service';
import { HaTagValue, HaTagValueEditDTO } from '../ha-entities/ha-tag-value.class';
import { Observable } from 'rxjs';
import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';

@Injectable({
  providedIn: 'root',
})
export class HaCoServiceConfig extends CoConfig {
  private tagService = inject(HaTagService);

  getSpacePhotoUrl(filename: string): string {
    return HaEnvironmentHelper.getConstellabApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityFrontUrl(): string {
    return HaEnvironmentHelper.getCommunityFrontUrl();
  }

  getCommunityApiUrl(): string {
    return HaEnvironmentHelper.getApiUrl();
  }

  createTagValue(tagValueEdit: HaTagValueEditDTO): Observable<HaTagValue> {
    return this.tagService.createValue(tagValueEdit);
  }

  updateTagValue(tagValueEdit: HaTagValueEditDTO): Observable<HaTagValue> {
    return this.tagService.updateValue(tagValueEdit);
  }

  addAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    return this.tagService.createAdditionalInfoSpec(tagKey, specName, spec);
  }

  deleteAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs> {
    return this.tagService.deleteAdditionalInfoSpec(tagKey, specName);
  }

  editAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    return this.tagService.updateAdditionalInfoSpec(tagKey, specName, spec);
  }

  renameAndEditAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    return this.tagService.renameAndEditAdditionalInfoSpec(tagKey, oldName, newName, spec);
  }
}
