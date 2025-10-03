import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';

import { HaCommunityApp } from '../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';

@Injectable()
export class HaCommunityAppState {
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  private appStatusEvent: WritableSignal<FlStatusEvent<HaCommunityApp>> =
    signal<FlStatusEvent<HaCommunityApp>>(null);

  private currentUser: WritableSignal<HaUser> = signal<HaUser>(null);

  private appCoAuthors: WritableSignal<HaUser[]> = signal<HaUser[]>(null);

  public canEditApp: Signal<boolean> = computed(() => {
    if (!this.currentUser()) return false;
    if (this.isLoading() || !this.app()) return false;
    if (this.currentUser().id === this.app().createdBy.id) return true;
    if (!this.appCoAuthors()) return false;
    return this.appCoAuthors().some((coAuthor) => coAuthor.id === this.currentUser().id);
  });

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

  public getCoAuthors(): Signal<HaUser[]> {
    return this.appCoAuthors;
  }

  public getCurrentUser(): Signal<HaUser> {
    return this.currentUser;
  }

  public init(appId: string): void {
    this.appStatusEvent.set({ status: 'loading' });

    this.communityAppService.getById(appId).subscribe({
      next: (app) => {
        this.appStatusEvent.set({ status: 'success', object: app });
        this.initUser(appId);
      },
      error: () => this.appStatusEvent.set({ status: 'error', error: 'app_not_found' }),
    });
  }

  public set(app: HaCommunityApp): void {
    this.appStatusEvent.set({ status: 'success', object: app });
    this.initUser(app.id);
  }

  public initCoAuthors(appId: string): void {
    this.communityAppService.getCoAuthors(appId).subscribe((coAuthors) => {
      this.appCoAuthors.set(coAuthors);
    });
  }

  public clean(): void {
    this.appStatusEvent.set(null);
    this.currentUser.set(null);
    this.appCoAuthors.set(null);
  }

  private initUser(appId: string): void {
    this.authenticatedUserService.getUser().subscribe((user) => {
      this.currentUser.set(user);
      this.initCoAuthors(appId);
    });
  }


}
