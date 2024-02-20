import {Component, Inject, makeStateKey, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaStory} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {HaStoryTextEditorConfig} from '../ha-story-edit-page/ha-story-text-editor.config';
import {FormControl} from '@ngneat/reactive-forms';
import {HaMetadataService} from '../../../ha-core/ha-service/ha-metadata.service';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {HaStoryFile} from '../../../ha-core/ha-model/ha-entities/ha-story-file';
import {TeRichText} from '@monorepo/text-editor';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaFileHelper} from '../../../ha-core/ha-helper/ha-file.helper';

@Component({
  selector: 'ha-story-page',
  templateUrl: './ha-story-page.component.html',
  styleUrls: ['./ha-story-page.component.scss']
})
export class HaStoryPageComponent implements OnInit {

  story: HaStory;

  textEditorConfig: HaStoryTextEditorConfig;

  formControl: FormControl<TeRichText> = new FormControl();

  titles: any[];

  STORY_KEY: StateKey<object>;

  storiesListRoute = HaRouterService.getStoriesListRoute();

  currentUser: HaUser;

  hasRightToEdit: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private storyService: HaStoryService,
              private metadataService: HaMetadataService,
              @Inject(PLATFORM_ID) private platformId: object,
              private transferState: TransferState,
              private authenticatedUserService: HaAuthenticatedUserService) {
  }

  ngOnInit(): void {
    this.STORY_KEY = makeStateKey<object>('story');

    this.activatedRoute.params.subscribe(params => {
      this.textEditorConfig = new HaStoryTextEditorConfig(this.storyService, params.id);
      this.getCurrentUserBeforeStory(params.id);
    });
  }

  private getCurrentUserBeforeStory(storyId: string): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
      this.getStory(storyId);
    });
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
      this.storyService.getById(id).subscribe((story: HaStory) => {
        this.onStory(story);
      });
    }
  }

  getStoryImageLink(imageName: string): string {
    return ClStringHelper.isHttpLink(imageName) ? imageName : this.storyService.getImageUrl(imageName);
  }

  downloadFile(file: HaStoryFile): string {
    // download file from server (not from the client)
    return this.storyService.getStoryFilePath(file.id);
  }

  private onStory(story: HaStory): void {
    if (story == null) {
      return;
    }
    this.story = story;
    this.formControl.setValue(this.story.content);
    this.formControl.disable({emitEvent: true});
    this.titles = TeRichText.getTitles(this.story.content, [2, 3]);
    if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.STORY_KEY)) {
      this.transferState.set(this.STORY_KEY, {story: story, titles: this.titles});
    }
    this.hasRightToEdit = this.currentUser != null &&
      this.story.storyAuthors.find(storyAuthor => storyAuthor.user.id === this.currentUser.id) != null;
    this.metadataService.setPageTitle('ha.story.title', true, {title: this.story.title});
    this.metadataService.addMetaTag('description', 'ha.story.description', true, {title: this.story.title});
    this.metadataService.addMetaTag('og:image', this.getStoryImageLink(this.story.mainPicture), false);
  }

  getFileIcon(filename: string): string {
    return HaFileHelper.getFileIcon(filename);
  }
}
