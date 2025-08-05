import { Injectable } from '@angular/core';
import { CoConfig, CoTagValue } from '@monorepo/community-lib';
import { TdParamSpecs } from '@monorepo/technical-doc';
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

  addAdditionalInfoSpec(): Observable<TdParamSpecs> {
    return undefined;
  }

  createTagValue(): Observable<CoTagValue> {
    return undefined;
  }

  deleteAdditionalInfoSpec(): Observable<TdParamSpecs> {
    return undefined;
  }

  editAdditionalInfoSpec(): Observable<TdParamSpecs> {
    return undefined;
  }

  renameAndEditAdditionalInfoSpec(): Observable<TdParamSpecs> {
    return undefined;
  }

  updateTagValue(): Observable<CoTagValue> {
    return undefined;
  }
}
