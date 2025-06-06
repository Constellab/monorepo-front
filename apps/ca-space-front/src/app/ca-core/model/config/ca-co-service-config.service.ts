import { Injectable } from '@angular/core';
import { CoConfig, CoTagValue, CoTagValueEditDTO } from '@monorepo/community-lib';
import { CaEnvironmentHelper } from '../../utils/ca-environment.helper';
import { TdEditParamSpecDict, TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaCoServiceConfig extends CoConfig {
  getSpacePhotoUrl(filename: string): string {
    return CaEnvironmentHelper.getApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityApiUrl(): string {
    return CaEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return CaEnvironmentHelper.getCommunityFrontUrl();
  }

  addAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    return undefined;
  }

  createTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    return undefined;
  }

  deleteAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs> {
    return undefined;
  }

  editAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    return undefined;
  }

  renameAndEditAdditionalInfoSpec(tagKey: string, oldName: string, newName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    return undefined;
  }

  updateTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    return undefined;
  }
}
