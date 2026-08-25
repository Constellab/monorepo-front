import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { first } from 'rxjs';

import { HaCommunityApp } from '../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';

@Injectable()
export class HaCommunityAppState {
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  private appStatusEvent: WritableSignal<FlStatusEvent<HaCommunityApp> | null> =
    signal<FlStatusEvent<HaCommunityApp> | null>(null);

  private currentUser: WritableSignal<HaUser | null> = signal<HaUser | null>(null);

  private appCoAuthors: WritableSignal<HaUser[] | null> = signal<HaUser[] | null>(null);

  public canEditApp: Signal<boolean> = computed(() => {
    const currentUser = this.currentUser();
    const app = this.app();
    if (!currentUser) return false;
    if (this.isLoading() || !app) return false;
    if (currentUser.id === app.createdBy.id) return true;
    const appCoAuthors = this.appCoAuthors();
    if (!appCoAuthors) return false;
    return appCoAuthors.some((coAuthor) => coAuthor.id === currentUser.id);
  });

  public isLoading: Signal<boolean> = computed(() => {
    const appStatusEvent = this.appStatusEvent();
    return appStatusEvent != null && appStatusEvent.status == 'loading';
  });
  public isErrored: Signal<boolean> = computed(() => {
    const appStatusEvent = this.appStatusEvent();
    return appStatusEvent != null && appStatusEvent.status == 'error';
  });

  public app: Signal<HaCommunityApp | null> = computed(() => {
    const appStatusEvent = this.appStatusEvent();
    if (appStatusEvent && appStatusEvent.status == 'success') return appStatusEvent.object;
    return null;
  });

  public getCoAuthors(): Signal<HaUser[] | null> {
    return this.appCoAuthors;
  }

  public getCurrentUser(): Signal<HaUser | null> {
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
    this.authenticatedUserService
      .getUser()
      .pipe(first())
      .subscribe((user) => {
        this.currentUser.set(user ?? null);
        this.initCoAuthors(appId);
      });
  }
}
