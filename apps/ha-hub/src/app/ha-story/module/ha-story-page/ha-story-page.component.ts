import {Component, Inject, makeStateKey, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaStory} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {HaStoryTextEditorConfig} from '../ha-story-edit-page/ha-story-text-editor.config';
import {FormControl} from '@ngneat/reactive-forms';
import {HaMetadataService} from '../../../ha-core/ha-service/ha-metadata.service';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {HaFile} from '../../../ha-core/entity-module/ha-file-core/model/ha-file';
import {TeRichText} from '@monorepo/text-editor';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaLikeService} from '../../../ha-core/ha-service/ha-like.service';
import {HaAuthService} from '../../../ha-core/ha-service/ha-auth.service';
import {FlPortalService} from '@monorepo/front-core-lib';
import {HaLikeType} from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import {
  HaCommentsPortalConfig
} from '../../../ha-core/entity-module/ha-comments-core/model/ha-comments-portal-config.class';
import {HaCommentType} from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import {
  HaCommentsPortalComponent,
  HaCommentsPortalData
} from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-portal/ha-comments-portal.component';
import {first} from 'rxjs';
import {HaHttpRedirectionService} from '../../../ha-core/ha-service/ha-http-redirection.service';

@Component({
  selector: 'ha-story-page',
  templateUrl: './ha-story-page.component.html',
  styleUrls: ['./ha-story-page.component.scss'],
})
export class HaStoryPageComponent implements OnInit {

  story: HaStory;

  textEditorConfig: HaStoryTextEditorConfig;

  formControl: FormControl<TeRichText> = new FormControl();

  titles: any[];

  STORY_KEY: StateKey<object>;

  storiesListRoute = HaRouterService.getStoriesListRoute();

  profileRoute = HaRouterService.getProfileRoute();

  currentUser: HaUser;

  hasRightToEdit: boolean;

  storyCoAuthors: HaUser[] = [];

  storyIsLiked: boolean;

  notFound = false;

  paramTitle: string;



  constructor(private activatedRoute: ActivatedRoute,
              private storyService: HaStoryService,
              private metadataService: HaMetadataService,
              @Inject(PLATFORM_ID) private platformId: object,
              private transferState: TransferState,
              private authenticatedUserService: HaAuthenticatedUserService,
              private authService: HaAuthService,
              private likeService: HaLikeService,
              private router: Router,
              private portalService: FlPortalService,
              private httpRedirectionService: HaHttpRedirectionService) {
  }

  ngOnInit(): void {
    this.STORY_KEY = makeStateKey<object>('story');

    this.activatedRoute.params.pipe(first()).subscribe(params => {
      this.textEditorConfig = new HaStoryTextEditorConfig(this.storyService, params.id);
      this.paramTitle = params.title;
      this.getCurrentUserBeforeStory(params.id);
      this.checkIfStoryIsLiked(params.id);
    });
  }

  openCommentsPannel(): void {
    this.portalService.createPortal(HaCommentsPortalComponent, HaCommentsPortalConfig.create(), {
      user: this.currentUser,
      entity: this.story,
      commentType: HaCommentType.STORY_COMMENT
    } as HaCommentsPortalData);

  }

  private getCurrentUserBeforeStory(storyId: string): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
      this.getStory(storyId);
    });
  }

  private checkIfStoryIsLiked(storyId: string): void {
    this.likeService.checkIfLiked(HaLikeType.STORY_LIKE, storyId).subscribe({
      next: (isLiked: boolean) => {
        this.storyIsLiked = isLiked;
      },
      error: () => {
        this.redirect404();
      }
    });
  }

  getStoryImageLink(imageLinkOrId: string): string {
    return ClStringHelper.isHttpLink(imageLinkOrId) ? imageLinkOrId : this.storyService.getImageUrl(this.story.id, imageLinkOrId);
  }

  downloadFile(file: HaFile): string {
    // download file from server (not from the client)
    return this.storyService.getStoryFilePath(this.story.id, file.name);
  }

  private getStory(id: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.STORY_KEY)) {
      const story: HaStory = new HaStory();
      const result: any = this.transferState.get(this.STORY_KEY, null);
      story.init(result.story as HaStory);
      this.titles = result.titles;
      this.onStory(story);
      this.transferState.remove(this.STORY_KEY);
    } else {
      this.storyService.getById(id).subscribe({
        next: (story: HaStory) => {
          this.onStory(story);
        },
        error: () => {
          this.redirect404();
        }
      });
    }
  }

  private getStoryCoAuthors(): void {
    this.storyService.getCoAuthors(this.story.id).subscribe((coAuthors: HaUser[]) => {
      this.storyCoAuthors = coAuthors;
      this.hasRightToEdit = this.currentUser != null && (this.currentUser.id == this.story.createdBy.id ||
        this.storyCoAuthors?.find(storyCoAuthor => storyCoAuthor.id === this.currentUser.id) != null);
    });
  }

  toggleLikeStoryButton(): void{
    if(this.storyIsLiked){
      this.unlikeStory();
    } else {
      this.likeStory();
    }
  }

  private unlikeStory(): void {
    this.likeService.unlike(HaLikeType.STORY_LIKE, this.story.id).subscribe((story: HaStory) => {
      if (story != null) {
        this.story = story;
        this.storyIsLiked = false;
      }
    });
  }

  private likeStory(): void {
    if (!this.authService.hasAuthorizationCookie()){
      // navigate to login page
      this.router.navigate(['/login'])
      return;
    }
    this.likeService.like(HaLikeType.STORY_LIKE, this.story.id).subscribe((story: HaStory) => {
      if (story != null) {
        this.story = story;
        this.storyIsLiked = true;
      }
    });
  }

  private onStory(story: HaStory): void {
    if (story == null) {
      return;
    }
    this.story = story;

    // verif if redirection needed
    if (this.paramTitle != ClStringHelper.getCleanUrlPath(this.story.title)) {
      this.httpRedirectionService.redirectTo(
        HaRouterService.getStoryRoute(this.story.id, ClStringHelper.getCleanUrlPath(this.story.title)));
    }

    this.formControl.setValue(this.story.content);
    this.formControl.disable({emitEvent: true});
    this.titles = TeRichText.getTitles(this.story.content, [2, 3]);
    if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.STORY_KEY)) {
      this.transferState.set(this.STORY_KEY, {story: story, titles: this.titles});
    }
    this.getStoryCoAuthors();

    this.metadataService.setPageTitle('ha.story.title', true, {title: this.story.title});
    this.metadataService.addMetaTag('description', 'ha.story.description', true, {title: this.story.title});
    this.metadataService.addMetaTag('og:image', this.getStoryImageLink(this.story.mainPicture), false);
  }

  private redirect404(): void {
    this.notFound = true;
  }
}
