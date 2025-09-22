import { Injectable } from '@angular/core';
import { CoConfig, CoSpace, CoTagValue, CoTagValueEditDTO } from '@monorepo/community-lib';
import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { CaEnvironmentHelper } from '../../utils/ca-environment.helper';

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
    throw new Error(`Error: addAdditionalInfoSpec not implemented in
    CaCoServiceConfig for tagKey: ${tagKey} and specName: ${specName} with spec: ${JSON.stringify(spec)}`);
  }

  createTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    throw new Error(`Error: createTagValue not implemented
    in CaCoServiceConfig for tagValueEdit: ${JSON.stringify(tagValueEdit)}`);
  }

  deleteAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs> {
    throw new Error(`Error: deleteAdditionalInfoSpec not implemented in
    CaCoServiceConfig for tagKey: ${tagKey} and specName: ${specName}`);
  }

  editAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    throw new Error(`Error: editAdditionalInfoSpec not implemented in
    CaCoServiceConfig for tagKey: ${tagKey} and specName: ${specName} with spec: ${JSON.stringify(spec)}`);
  }

  renameAndEditAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    throw new Error(`Error: renameAndEditAdditionalInfoSpec not implemented in
    CaCoServiceConfig for tagKey: ${tagKey}, oldName: ${oldName}
    , newName: ${newName} with spec: ${JSON.stringify(spec)}`);
  }

  updateTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    throw new Error(`Error: updateTagValue not implemented in
    CaCoServiceConfig for tagValueEdit: ${JSON.stringify(tagValueEdit)}`);
  }

  getSpacesOfCurrentUser():Observable<CoSpace[]>{
    throw new Error(`Error: getSpacesOfCurrentUser() not implemented in CaCoServiceConfig`);
  }
}
