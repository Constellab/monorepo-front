import { inject, Injectable } from '@angular/core';
import { CoConfig, CoTagValue, CoTagValueEditDTO } from '@monorepo/community-lib';
import { LabEnvironmentHelper } from './lab-environment.helper';
import { Observable } from 'rxjs';
import { LiTagService } from '@monorepo/lab-lib/li-core';
import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';

@Injectable({
  providedIn: 'root',
})
export class LabCoServiceConfig extends CoConfig {
  private tagService = inject(LiTagService);

  getSpacePhotoUrl(filename: string): string {
    return LabEnvironmentHelper.getSpaceApiUrl() + '/spaces/photo/' + filename;
  }

  getCommunityApiUrl(): string {
    return LabEnvironmentHelper.getCommunityApiUrl();
  }

  getCommunityFrontUrl(): string {
    return LabEnvironmentHelper.getCommunityFrontUrl();
  }

  getCommunityAgentPageUrl(agentId: string): string {
    return LabEnvironmentHelper.getCommunityFrontUrl() + '/agents/' + agentId;
  }

  public createTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    return this.tagService.createTagValue(tagValueEdit);
  }

  public updateTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue> {
    return this.tagService.updateTagValue(tagValueEdit);
  }

  public addAdditionalInfoSpec(
    tagKey: string,
    specName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    throw new Error('Method not implemented.');
  }

  public deleteAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs> {
    throw new Error('Method not implemented.');
  }

  public editAdditionalInfoSpec(
    tagKey: string,
    specName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    throw new Error('Method not implemented.');
  }

  public renameAndEditAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    throw new Error('Method not implemented.');
  }
}
