/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { CoConfig, CoTagValue, CoTagValueEditDTO } from '@monorepo/community-lib';
import { DcEnvironmentHelper } from '../dc-environment.helper';
import { TdEditParamSpecDict, TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DcCoServiceConfig extends CoConfig {
  getSpacePhotoUrl(filename: string): string {
    return DcEnvironmentHelper.getSpaceApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityApiUrl(): string {
    return DcEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return DcEnvironmentHelper.getCommunityFrontUrl();
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
