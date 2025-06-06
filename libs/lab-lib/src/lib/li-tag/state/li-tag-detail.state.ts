import { inject, Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { LiTagKeyModel, LiTagService, LiTagValueModelDatasource } from '@monorepo/lab-lib/li-core';

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

  public ngOnDestroy(): void {
    this._tagKey.set(null);
  }
}
