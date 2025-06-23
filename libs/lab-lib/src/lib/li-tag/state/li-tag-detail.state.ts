import { inject, Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { LiTagKeyModel, LiTagService, LiTagValueModelDatasource } from '@monorepo/lab-lib/li-core';
import { TdParamSpecs } from '@monorepo/technical-doc';

@Injectable()
export class LiTagDetailState implements OnDestroy {
  private tagService = inject(LiTagService);

  private _tagKey: WritableSignal<LiTagKeyModel> = signal(null);

  private _values$: WritableSignal<LiTagValueModelDatasource> = signal(null);

  public get tagKey(): Signal<LiTagKeyModel> {
    return this._tagKey;
  }

  public get values$(): Signal<LiTagValueModelDatasource> {
    return this._values$;
  }

  public init(key: string): void {
    this.tagService.getTagKeyByKey(key).subscribe((tagKey: LiTagKeyModel) => {
      if (tagKey) {
        this._tagKey.set(tagKey);
        this.onNewTagKey(tagKey);
      }
    });
  }

  public onNewTagKey(tagKey: LiTagKeyModel): void {
    this._values$.set(this.tagService.getValuesDatasource(tagKey.key));
  }

  public updateTagKey(tagKey: LiTagKeyModel): void {
    this._tagKey.set(tagKey);
  }

  public updateTagKeyAdditionalInfoSpecs(additionalInfoSpecs: TdParamSpecs): void {
    const tagKey = this._tagKey();
    if (tagKey) {
      tagKey.additionalInfosSpecs = additionalInfoSpecs;
      this._tagKey.set(tagKey);
    }
  }

  public ngOnDestroy(): void {
    this._tagKey.set(null);
  }
}
