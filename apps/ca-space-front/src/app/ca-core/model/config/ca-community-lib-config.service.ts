import { Injectable } from '@angular/core';
import { CoConfig, CoSpace, CoTagValue } from '@monorepo/community-lib';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { CaEnvironmentHelper } from '../../utils/ca-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class CaCommunityLibConfigService extends CoConfig {
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
    throw new Error(`Error: addAdditionalInfoSpec not implemented`);
  }

  createTagValue(): Observable<CoTagValue> {
    throw new Error(`Error: createTagValue not implemented`);
  }

  deleteAdditionalInfoSpec(): Observable<TdParamSpecs> {
    throw new Error(`Error: deleteAdditionalInfoSpec not implemented`);
  }

  editAdditionalInfoSpec(): Observable<TdParamSpecs> {
    throw new Error(`Error: editAdditionalInfoSpec not implemented`);
  }

  renameAndEditAdditionalInfoSpec(): Observable<TdParamSpecs> {
    throw new Error(`Error: renameAndEditAdditionalInfoSpec not implemented`);
  }

  updateTagValue(): Observable<CoTagValue> {
    throw new Error(`Error: updateTagValue not implemented `);
  }

  getSpacesOfCurrentUser(): Observable<CoSpace[]> {
    throw new Error(`Error: getSpacesOfCurrentUser() not implemented`);
  }
}
