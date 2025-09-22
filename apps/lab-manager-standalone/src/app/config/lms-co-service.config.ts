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
    return null;
  }

  getCommunityApiUrl(): string {
    return LmsEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return LmsEnvironmentHelper.getCommunityFrontUrl();
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

  renameAndEditAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    return undefined;
  }

  updateTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    return undefined;
  }

  getSpacesOfCurrentUser():Observable<CoSpace[]>{
    throw new Error(`Error: getSpacesOfCurrentUser() not implemented in LmsCoServiceConfig`);
  }
}
