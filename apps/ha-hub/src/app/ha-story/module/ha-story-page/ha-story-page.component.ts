import {
  Component,
  inject,
  makeStateKey,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  StateKey,
  TransferState,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaStoryTextEditorConfig } from '../ha-story-edit-page/ha-story-text-editor.config';

import { isPlatformBrowser } from '@angular/common';
import { ClCoreJsonConvert, ClStringHelper } from '@monorepo/core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaFile } from '../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { first, Subscription } from 'rxjs';
import { HaHttpRedirectionService } from '../../../ha-core/ha-service/ha-http-redirection.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HaCommunityPage } from '../../../ha-core/utils/ha-community.page';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { HaShareButtonComponent } from '../../../ha-core/entity-module/ha-share-core/component/ha-share-button/ha-share-button.component';
import { HaLikeButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-like-button/ha-like-button.component';
import { HaCommentButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-comment-button/ha-comment-button.component';
import { MatAnchor } from '@angular/material/button';
import { Ha404Component } from '../../../ha-public/module/ha404/ha404.component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { HaTextEditorRightSidePanelComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-text-editor-right-side-panel/ha-text-editor-right-side-panel.component';
import { TranslatePipe } from '@ngx-translate/core';
import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';

@Component({
  selector: 'ha-story-page',
  templateUrl: './ha-story-page.component.html',
  styleUrls: ['./ha-story-page.component.scss'],
  imports: [
    RouterLink,
    FlTextIconModule,
    MatIcon,
    FlUserModule,
    FlDateModule,
    FlKeyValueModule,
    HaShareButtonComponent,
    HaCommentButtonComponent,
    MatAnchor,
    TeTextEditorModule,
    ReactiveFormsModule,
    Ha404Component,
    FlLoaderModule,
    HaTextEditorRightSidePanelComponent,
    TranslatePipe,
    HaCommentsSectionComponent,
    HaLikeButtonComponent,
  ],
})
export class HaStoryPageComponent extends HaCommunityPage implements OnInit, OnDestroy {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private storyService: HaStoryService = inject(HaStoryService);
  private platformId: object = inject(PLATFORM_ID);
  private transferState: TransferState = inject(TransferState);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private router: Router = inject(Router);
  private httpRedirectionService: HaHttpRedirectionService = inject(HaHttpRedirectionService);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);

  story: HaStory;

  content: TeRichText;

  textEditorConfig: HaStoryTextEditorConfig;

  formControl: FormControl<TeRichText> = new FormControl();

  STORY_KEY: StateKey<object>;

  storiesListRoute = HaRouterService.getStoriesListRoute();

  profileRoute = HaRouterService.getProfileRoute();

  currentUser: HaUser;

  hasRightToEdit: boolean;

  storyCoAuthors: HaUser[] = [];

  notFound = false;

  paramTitle: string;

  storyFiles: HaFile[];

  urlToDownloadFilePrefix: string;

  subscription: Subscription;

  commentType: HaEntityType = HaEntityType.STORY;

  ngOnInit(): void {
    this.STORY_KEY = makeStateKey<object>('story');

    this.activatedRoute.params.pipe(first()).subscribe((params) => {
      this.urlToDownloadFilePrefix = this.storyService.getStoryFilePathPrefix(params.id);
      this.textEditorConfig = new HaStoryTextEditorConfig(this.storyService, params.id);
      this.paramTitle = params.title;
      this.getCurrentUserBeforeStory(params.id);
    });
  }

  private getCurrentUserBeforeStory(storyId: string): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
      this.getStory(storyId);
    });
  }

  scrollToComments(commentsSection: any): void {
    commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  getStoryImageLink(imageLinkOrId: string): string {
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(this.story.id, imageLinkOrId);
  }

  private getStory(id: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.STORY_KEY)) {
      const result: any = this.transferState.get(this.STORY_KEY, null);
      const story = ClCoreJsonConvert.deserializeObject(result.story, HaStory);
      this.onStory(story);
      this.transferState.remove(this.STORY_KEY);
    } else {
      this.storyService.getById(id).subscribe({
        next: (story: HaStory) => {
          this.onStory(story);
        },
        error: () => {
          this.redirect404();
        },
      });
    }
  }

  private getStoryCoAuthors(): void {
    this.storyService.getCoAuthors(this.story.id).subscribe((coAuthors: HaUser[]) => {
      this.storyCoAuthors = coAuthors;
      this.hasRightToEdit =
        this.currentUser != null &&
        (this.currentUser.id == this.story.createdBy.id ||
          this.storyCoAuthors?.find((storyCoAuthor) => storyCoAuthor.id === this.currentUser.id) != null);
    });
  }

  private getStoryFiles(): void {
    this.storyService.getStoryFiles(this.story.id).subscribe((files: HaFile[]) => {
      this.storyFiles = files;
    });
  }

  private onStory(story: HaStory): void {
    if (story == null) {
      return;
    }
    this.story = story;
    this.content = story.content;

    // verif if redirection needed
    if (this.paramTitle != ClStringHelper.getCleanUrlPath(this.story.title)) {
      this.httpRedirectionService.redirectTo(
        HaRouterService.getStoryRoute(this.story.id, ClStringHelper.getCleanUrlPath(this.story.title))
      );
    }

    this.formControl.setValue(this.story.content);
    this.formControl.disable({ emitEvent: true });
    this.getStoryCoAuthors();
    this.getStoryFiles();

    const storyFigureBlocks = this.story.content.getFiguresBlocks();
    const storyImageLinks = storyFigureBlocks.map((figureBlock) =>
      this.getStoryImageLink(figureBlock.data.filename)
    );

    this.jsonLdState.setArticleJsonLdContent(story.title, storyImageLinks, story.createdAt, [
      story.createdBy,
    ]);

    super.setMetaTags(
      {
        text: 'ha.story.title',
        translateParam: { param: { title: this.story.title } },
      },
      {
        text: 'ha.story.description',
        translateParam: { param: { title: this.story.title } },
      },
      this.getStoryImageLink(this.story.mainPicture),
      HaRouterService.getFullRoute(this.router.url)
    );
  }

  private redirect404(): void {
    this.notFound = true;
  }

  ngOnDestroy(): void {
    this.jsonLdState.clearJsonLdContent();
  }
}
