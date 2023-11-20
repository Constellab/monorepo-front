import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaStory} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {HaStoryTextEditorConfig} from '../ha-story-edit-page/ha-story-text-editor.config';
import {FlDialogService} from '@monorepo/front-core-lib';
import {FormControl} from '@ngneat/reactive-forms';
import {HaMetadataService} from '../../../ha-core/ha-service/ha-metadata.service';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {ClRichText, ClRichTextI, ClStringHelper} from '@monorepo/core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {HaStoryFile} from '../../../ha-core/ha-model/ha-entities/ha-story-file';

@Component({
  selector: 'ha-story-page',
  templateUrl: './ha-story-page.component.html',
  styleUrls: ['./ha-story-page.component.scss']
})
export class HaStoryPageComponent implements OnInit {

  story: HaStory;

  textEditorConfig: HaStoryTextEditorConfig;

  formControl: FormControl<ClRichTextI> = new FormControl();

  titles: any[];

  STORY_KEY: StateKey<object>;

  storiesListRoute = HaRouterService.getStoriesListRoute();

  constructor(private activatedRoute: ActivatedRoute,
    private storyService: HaStoryService,
    private dialogService: FlDialogService,
    private metadataService: HaMetadataService,
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState) {
  }

  ngOnInit(): void {
    this.STORY_KEY = makeStateKey<object>('story');

    this.textEditorConfig = new HaStoryTextEditorConfig(this.storyService, this.dialogService);

    this.activatedRoute.params.subscribe(params => {
      this.getStory(params.id);
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

  private onStory(story: HaStory): void {
    this.story = story;
    this.formControl.setValue(this.story.content);
    this.formControl.disable({emitEvent: true});
    this.titles = this.titles == null || this.titles.length == 0 ?
      (new ClRichText(this.story.content)).getHeaders([2, 3]) : this.titles;
    if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.STORY_KEY)) {
      this.transferState.set(this.STORY_KEY, {story: story, titles: this.titles});
    }
    this.metadataService.setPageTitle('ha.story.title', true, {title: this.story.title});
    this.metadataService.addMetaTag('description', 'ha.story.description', true, {title: this.story.title});
    this.metadataService.addMetaTag('og:image', this.getStoryImageLink(this.story.mainPicture), false);
  }

  getStoryImageLink(imageName: string): string {
    return ClStringHelper.isHttpLink(imageName) ? imageName : this.storyService.getImageUrl(imageName);
  }

  downloadFile(file: HaStoryFile): string{
    // download file from server (not from the client)
    return this.storyService.getStoryFilePath(file.id);
  }
}
