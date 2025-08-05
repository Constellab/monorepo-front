import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';

import { HaCommunityApp } from '../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';

@Injectable()
export class HaCommunityAppState {
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);

  private appStatusEvent: WritableSignal<FlStatusEvent<HaCommunityApp>> =
    signal<FlStatusEvent<HaCommunityApp>>(null);
  public isLoading: Signal<boolean> = computed(
    () => this.appStatusEvent() && this.appStatusEvent().status == 'loading'
  );
  public isErrored: Signal<boolean> = computed(
    () => this.appStatusEvent() && this.appStatusEvent().status == 'error'
  );

  public app: Signal<HaCommunityApp> = computed(() => {
    const appStatusEvent = this.appStatusEvent();
    if (appStatusEvent && appStatusEvent.status == 'success') return appStatusEvent.object;
    return null;
  });

  public init(appId: string): void {
    this.appStatusEvent.set({ status: 'loading' });

    this.communityAppService.getById(appId).subscribe({
      next: (app) => this.appStatusEvent.set({ status: 'success', object: app }),
      error: () => this.appStatusEvent.set({ status: 'error', error: 'app_not_found' }),
    });
  }

  public set(app: HaCommunityApp): void {
    this.appStatusEvent.set({ status: 'success', object: app });
  }
}
