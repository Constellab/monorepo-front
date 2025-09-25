import { computed, inject, Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { filter, Subscription } from 'rxjs';

import {
  HaAgentCreateDialogComponent,
  HaCreateAgentInput,
} from '../../ha-agent/components/ha-agent-create-dialog/ha-agent-create-dialog.component';
import { HaCreateBrickDialogComponent } from '../../ha-brick/ha-bricks/ha-create-brick-dialog/ha-create-brick-dialog.component';
import {
  HaCommunityAppCreateDialogComponent,
  HaCreateCommunityAppInput,
} from '../../ha-community-app/components/ha-community-app-create-dialog/ha-community-app-create-dialog.component';
import {
  HaCreateStoryDtoInput,
  HaStoryEditDialogComponent,
} from '../../ha-story/module/ha-story-edit-dialog/ha-story-edit-dialog.component';
import { HaAgentVersion } from '../ha-model/ha-entities/ha-agent-version.class';
import { HaCommunityApp } from '../ha-model/ha-entities/ha-community-app.class';
import { HaEntityType } from '../ha-model/ha-entities/ha-entity-type';
import { HaStory } from '../ha-model/ha-entities/ha-story.class';
import { HaAgentService } from '../ha-service/ha-agent.service';
import { HaBrickService } from '../ha-service/ha-brick.service';
import { HaCommunityAppService } from '../ha-service/ha-community-app.service';
import { HaRouterService } from '../ha-service/ha-router.service';
import { HaStoryService } from '../ha-service/ha-story.service';
import { HaTagService } from '../ha-service/ha-tag.service';
import {
  HaTagKeyEditDialogComponent,
  HaTagKeyEditDialogInput,
} from '../../ha-tag/module/ha-tag-key-edit-dialog/ha-tag-key-edit-dialog.component';
import { HaTagKey } from '../ha-model/ha-entities/ha-tag-key.class';

@Injectable()
export class HaCurrentPageState implements OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dialogService: FlDialogService = inject(FlDialogService);
  private storyService = inject(HaStoryService);
  private brickService = inject(HaBrickService);
  private agentService = inject(HaAgentService);
  private appService = inject(HaCommunityAppService);
  private tagService = inject(HaTagService);

  private currentPageSubscription: Subscription;

  private urls: WritableSignal<UrlSegment[]> = signal<UrlSegment[]>([]);

  private currentEntityType: WritableSignal<HaEntityType | null> = signal<HaEntityType | null>(null);

  public isDocumentationPage: WritableSignal<boolean> = signal<boolean>(false);

  public lastActivatedRoute: WritableSignal<ActivatedRoute> = signal<ActivatedRoute>(null);

  public entityService: Signal<
    HaStoryService | HaBrickService | HaAgentService | HaCommunityAppService | HaTagService | null
  > = computed(() => {
    switch (this.currentEntityType()) {
      case HaEntityType.STORY:
        return this.storyService;
      case HaEntityType.BRICK:
        return this.brickService;
      case HaEntityType.AGENT:
        return this.agentService;
      case HaEntityType.APP:
        return this.appService;
      case HaEntityType.TAG:
        return this.tagService;
      default:
        return null;
    }
  });

  public getUrls(): Signal<UrlSegment[]> {
    return this.urls;
  }

  public getCurrentEntityType(): Signal<HaEntityType | null> {
    return this.currentEntityType;
  }

  public init(): void {
    this.updateUrlSegments();

    this.currentPageSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateUrlSegments();
      });
  }

  public openCreateDialog(): void {
    switch (this.currentEntityType()) {
      case HaEntityType.STORY:
        this.openCreateStoryDialog();
        break;
      case HaEntityType.APP:
        this.openCreateCommunityAppDialog();
        break;
      case HaEntityType.BRICK:
        this.openCreateBrickDialog();
        break;
      case HaEntityType.AGENT:
        this.openAgentCreateDialog();
        break;
      case HaEntityType.TAG:
        this.openTagCreateDialog();
        break;
      default:
        break;
    }
  }

  private openTagCreateDialog(): void {
    const input: HaTagKeyEditDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(HaTagKeyEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tag: HaTagKey) => {
        if (tag) {
          this.router.navigateByUrl(HaRouterService.getTagPageRoute(tag.id, tag.technicalName));
        }
      });
  }

  private openAgentCreateDialog(): void {
    const input: HaCreateAgentInput = {
      mode: 'create',
      object: null,
    };

    this.dialogService
      .openMediumDialog(HaAgentCreateDialogComponent, { data: input })
      .afterClosed()
      .subscribe((agentVersion: HaAgentVersion) => {
        if (agentVersion) {
          this.router.navigateByUrl(HaRouterService.getAgentVersionRoute(agentVersion));
        }
      });
  }

  private openCreateBrickDialog(): void {
    this.dialogService.openMediumDialog(HaCreateBrickDialogComponent);
  }

  private openCreateStoryDialog(): void {
    const data: HaCreateStoryDtoInput = {
      mode: 'create',
      object: null,
    };

    this.dialogService
      .openSmallDialog(HaStoryEditDialogComponent, { data: data })
      .afterClosed()
      .subscribe((story: HaStory) => {
        if (story && story.id) {
          this.router.navigateByUrl(HaRouterService.getStoryEditRoute(story.id));
        }
      });
  }

  private openCreateCommunityAppDialog(): void {
    const data: HaCreateCommunityAppInput = {
      mode: 'create',
    };
    this.dialogService
      .openMediumDialog(HaCommunityAppCreateDialogComponent, { data: data })
      .afterClosed()
      .subscribe((communityApp: HaCommunityApp) => {
        if (communityApp && communityApp.id) {
          this.router.navigateByUrl(
            HaRouterService.getCommunityAppRoute(
              communityApp.id,
              ClStringHelper.getCleanUrlPath(communityApp.title)
            )
          );
        }
      });
  }

  private updateUrlSegments(): void {
    let route = this.activatedRoute;

    while (route.parent) {
      route = route.parent;
    }

    const urlSegments: UrlSegment[] = [];
    this.collectUrlSegments(route, urlSegments);

    this.onUrlSegments(urlSegments);
  }

  private onUrlSegments(urlSegments: UrlSegment[]): void {
    this.urls.set(urlSegments);
    this.setCurrentEntityType(urlSegments);
  }

  private setCurrentEntityType(urlSegments: UrlSegment[]): void {
    this.isDocumentationPage.set(false);

    if (urlSegments?.length == 0) return null;
    const firstSegment = urlSegments[0].path;
    switch (firstSegment) {
      case 'stories':
        this.currentEntityType.set(HaEntityType.STORY);
        break;
      case 'bricks':
        if (urlSegments.find((u) => u.path === 'doc')) {
          this.isDocumentationPage.set(true);
        }
        this.currentEntityType.set(HaEntityType.BRICK);
        break;
      case 'apps':
        this.currentEntityType.set(HaEntityType.APP);
        break;
      case 'agents':
        this.currentEntityType.set(HaEntityType.AGENT);
        break;
      case 'icons':
        this.currentEntityType.set(HaEntityType.ICON);
        break;
      case 'tags':
        this.currentEntityType.set(HaEntityType.TAG);
        break;
      default:
        return null;
    }
  }

  private collectUrlSegments(route: ActivatedRoute, segments: UrlSegment[]): void {
    segments.push(...route.snapshot.url);

    if (!route.children || route.children.length === 0) {
      this.lastActivatedRoute.set(route);
    }

    route.children.forEach((childRoute) => {
      this.collectUrlSegments(childRoute, segments);
    });
  }

  ngOnDestroy(): void {
    this.currentPageSubscription?.unsubscribe();
  }
}
