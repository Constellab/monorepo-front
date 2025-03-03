import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';
import { HaLikeService } from '../../ha-core/ha-service/ha-like.service';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { HaCommunityApp } from '../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaLikeType } from '../../ha-core/ha-model/ha-entities/ha-entity-type.enum';

@Injectable()
export class HaCommunityAppState {
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private likeService: HaLikeService = inject(HaLikeService);

  private appStatusEvent: WritableSignal<FlStatusEvent<HaCommunityApp>> =
    signal<FlStatusEvent<HaCommunityApp>>(null);
  private isLikedStatusEvent: WritableSignal<FlStatusEvent<boolean>> = signal<FlStatusEvent<boolean>>(null);
  private isAppLoading: Signal<boolean> = computed(
    () => this.appStatusEvent() && this.appStatusEvent().status == 'loading'
  );
  private isAppError: Signal<boolean> = computed(
    () => this.appStatusEvent() && this.appStatusEvent().status == 'error'
  );
  private isIsLikedLoading: Signal<boolean> = computed(
    () => this.isLikedStatusEvent() && this.isLikedStatusEvent().status == 'loading'
  );
  private isIsLikedError: Signal<boolean> = computed(
    () => this.isLikedStatusEvent() && this.isLikedStatusEvent().status == 'error'
  );

  public app: Signal<HaCommunityApp> = computed(() => {
    const appStatusEvent = this.appStatusEvent();
    if (appStatusEvent && appStatusEvent.status == 'success') return appStatusEvent.object;
    return null;
  });
  public isLiked: Signal<boolean> = computed(() => {
    const isLikedStatusEvent = this.isLikedStatusEvent();
    if (isLikedStatusEvent && isLikedStatusEvent.status == 'success') return isLikedStatusEvent.object;
    return null;
  });
  public likes: Signal<number> = computed(() => this.app()?.likes);
  public isLoading: Signal<boolean> = computed(() => this.isAppLoading() || this.isIsLikedLoading());
  public isErrored: Signal<boolean> = computed(() => this.isAppError() || this.isIsLikedError());

  public init(appId: string): void {
    this.appStatusEvent.set({ status: 'loading' });
    this.isLikedStatusEvent.set({ status: 'loading' });

    this.communityAppService.getById(appId).subscribe({
      next: (app) => this.appStatusEvent.set({ status: 'success', object: app }),
      error: () => this.appStatusEvent.set({ status: 'error', error: 'app_not_found' }),
    });

    this.likeService.checkIfLiked(HaLikeType.APP_LIKE, appId).subscribe({
      next: (isLiked) => this.isLikedStatusEvent.set({ status: 'success', object: isLiked }),
      error: () => this.isLikedStatusEvent.set({ status: 'error', error: 'is_like_not_found' }),
    });
  }

  public set(app: HaCommunityApp): void {
    this.appStatusEvent.set({ status: 'success', object: app });
  }

  public setIsLiked(isLiked: boolean): void {
    this.isLikedStatusEvent.set({ status: 'success', object: isLiked });
  }
}
