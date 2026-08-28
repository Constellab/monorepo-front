/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { CoConfig, CoSpace, CoTagValue, CoTagValueEditDTO } from '@monorepo/community-lib';
import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { LmsEnvironmentHelper } from './lms-environmnet.helper';

@Injectable({
  providedIn: 'root',
})
export class LmsCoServiceConfig extends CoConfig {
  getSpacePhotoUrl(): string {
    throw new Error(`Error: getSpacePhotoUrl() not implemented in LmsCoServiceConfig`);
  }

  getCommunityApiUrl(): string {
    return LmsEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return LmsEnvironmentHelper.getCommunityFrontUrl();
  }

  addAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    throw new Error(`Error: addAdditionalInfoSpec() not implemented in LmsCoServiceConfig`);
  }

  createTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    throw new Error(`Error: createTagValue() not implemented in LmsCoServiceConfig`);
  }

  deleteAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs> {
    throw new Error(`Error: deleteAdditionalInfoSpec() not implemented in LmsCoServiceConfig`);
  }

  editAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    throw new Error(`Error: editAdditionalInfoSpec() not implemented in LmsCoServiceConfig`);
  }

  renameAndEditAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    throw new Error(`Error: renameAndEditAdditionalInfoSpec() not implemented in LmsCoServiceConfig`);
  }

  updateTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    throw new Error(`Error: updateTagValue() not implemented in LmsCoServiceConfig`);
  }

  getSpacesOfCurrentUser(): Observable<CoSpace[]> {
    throw new Error(`Error: getSpacesOfCurrentUser() not implemented in LmsCoServiceConfig`);
  }
}
