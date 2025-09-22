import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { CoSpace } from '../model/co-space.class';
import { CoTagValue, CoTagValueEditDTO } from '../model/co-tag-value.class';

export abstract class CoConfig {
  public abstract getSpacePhotoUrl(filename: string): string;

  public abstract getCommunityFrontUrl(): string;

  public abstract getCommunityApiUrl(): string;

  public abstract createTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue>;

  public abstract updateTagValue(tagValueEdit: CoTagValueEditDTO): Observable<CoTagValue>;

  public abstract addAdditionalInfoSpec(
    tagKey: string,
    specName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs>;

  public abstract deleteAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs>;

  public abstract editAdditionalInfoSpec(
    tagKey: string,
    specName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs>;

  public abstract renameAndEditAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs>;

  public abstract getSpacesOfCurrentUser(): Observable<CoSpace[]>;
}
