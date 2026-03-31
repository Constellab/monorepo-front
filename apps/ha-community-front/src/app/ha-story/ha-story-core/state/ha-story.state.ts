import { computed, inject, Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { Subscription } from 'rxjs';

import { HaFile } from '../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';

@Injectable()
export class HaStoryState extends HaCommunityPageDirective implements OnDestroy {
  private storyService = inject(HaStoryService);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);

  private router: Router = inject(Router);

  private story: WritableSignal<HaStory> = signal(null);
  private storyFiles: WritableSignal<HaFile[]> = signal([]);
  private isLoading: WritableSignal<boolean> = signal(false);
  private notFound: WritableSignal<boolean> = signal(false);
  private storyFileUrlPrefix: WritableSignal<string> = signal<string>(null);
  private currentUser: WritableSignal<HaUser> = signal<HaUser>(null);

  private storySubscription: Subscription;
  private storyFilesSubscription: Subscription;
  private userSubscription: Subscription;

  public getStory(): Signal<HaStory> {
    return this.story;
  }

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }

  public getNotFound(): Signal<boolean> {
    return this.notFound;
  }

  public getStoryFiles(): Signal<HaFile[]> {
    return this.storyFiles;
  }

  public getStoryFileUrlPrefix(): Signal<string> {
    return this.storyFileUrlPrefix;
  }

  public getCurrentUser(): Signal<HaUser> {
    return this.currentUser;
  }

  public coAuthors = computed(() => {
    const story = this.story();
    if (!story || !story.storyAuthors) return [];
    return story.storyAuthors.map((storyAuthor) => storyAuthor.user);
  });

  public canEdit = computed(() => {
    const story = this.story();
    if (!story) return false;
    const user = this.currentUser();
    if (!user) return false;

    return (
      story.createdBy.id === user.id || this.coAuthors().some((storyCoAuthor) => storyCoAuthor.id === user.id)
    );
  });

  public init(storyId: string): void {
    this.initStory(storyId);
    this.initUser();
  }

  public initStory(storyId: string): void {
    this.isLoading.set(true);
    this.initStoryFiles(storyId);
    this.subscription = this.storyService.getById(storyId).subscribe({
      next: (story: HaStory) => {
        this.story.set(story);
        this.isLoading.set(false);
        this.notFound.set(false);

        const imageUrl = this.getStoryImageLink(story.mainPicture, story.id);
        const pageUrl = HaRouterService.getFullRoute(this.router.url);

        super.setMetaTags(
          {
            text: 'ha.story.title',
            translateParam: { param: { title: story.title } },
          },
          {
            text: 'ha.story.description',
            translateParam: { param: { title: story.title, author: story.createdBy?.alias } },
          },
          imageUrl,
          pageUrl,
          'article'
        );

        // Article-specific OG meta tags
        if (story.publishedAt) {
          this.metadataService.addMetaTag('article:published_time', String(story.publishedAt));
        }
        if (story.lastModifiedAt) {
          this.metadataService.addMetaTag('article:modified_time', String(story.lastModifiedAt));
        }
        if (story.createdBy?.alias) {
          this.metadataService.addMetaTag('article:author', story.createdBy.alias);
        }

        // JSON-LD Article schema
        const authors = [story.createdBy, ...(story.getCoAuthors() ?? [])].filter(Boolean);
        this.jsonLdState.setArticleJsonLdContent(
          story.title,
          imageUrl ? [imageUrl] : [],
          story.publishedAt ?? story.createdAt,
          authors
        );
      },
      error: () => {
        this.notFound.set(false);
        this.isLoading.set(false);
      },
    });
  }

  public getStoryImageLink(imageLinkOrId: string, storyId: string): string {
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(this.story()?.id ?? storyId, imageLinkOrId);
  }

  private initUser(): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser.set(user);
    });
  }

  private initStoryFiles(storyId: string): void {
    this.initStoryFileUrlPrefix(storyId);
    this.storyService.getStoryFiles(storyId).subscribe({
      next: (files: HaFile[]) => {
        this.storyFiles.set(files);
      },
      error: () => {
        this.storyFiles.set([]);
      },
    });
  }

  private initStoryFileUrlPrefix(storyId: string): void {
    this.storyFileUrlPrefix.set(this.storyService.getStoryFilePathPrefix(storyId));
  }

  ngOnDestroy(): void {
    this.jsonLdState.clearJsonLdContent();
    this.storySubscription?.unsubscribe();
    this.storyFilesSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
