import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaStory} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {HaStoryTextEditorConfig} from '../ha-story-edit-page/ha-story-text-editor.config';
import {FlDialogService} from '@monorepo/front-core-lib';
import {FormControl} from '@ngneat/reactive-forms';
import {CmRichText, CmRichTextI} from '@monorepo/common-model';
import {HaMetadataService} from '../../../ha-core/ha-service/ha-metadata.service';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {ClStringHelper} from '@monorepo/core-lib';

@Component({
  selector: 'ha-story-page',
  templateUrl: './ha-story-page.component.html',
  styleUrls: ['./ha-story-page.component.scss']
})
export class HaStoryPageComponent implements OnInit {

  story: HaStory;

  textEditorConfig: HaStoryTextEditorConfig;

  formControl: FormControl<CmRichTextI> = new FormControl<CmRichTextI>();

  titles: any[];

  STORY_KEY: StateKey<object>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private storyService: HaStoryService,
    private dialogService: FlDialogService,
    private metadataService: HaMetadataService,
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState
  ) {
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

  private onStory(story: HaStory): void{
    this.story = story;
    this.formControl.setValue(this.story.content);
    this.formControl.disable({emitEvent: true});
    this.titles = this.titles == null || this.titles.length == 0 ?
      (new CmRichText(this.story.content)).getHeaders([2, 3]) : this.titles;
    if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.STORY_KEY)){
      this.transferState.set(this.STORY_KEY, {story: story, titles: this.titles});
    }
    this.metadataService.setPageTitle('ha.story.title', true, {title: this.story.title});
    this.metadataService.addMetaTag('description', 'ha.story.description', true, {title: this.story.title});
    this.metadataService.addMetaTag('og:image', this.getStoryImageLink(this.story.mainPicture), false);
  }

  getStoryImageLink(imageName: string): string {
    return ClStringHelper.isHttpLink(imageName) ? imageName : this.storyService.getImageUrl(imageName);
  }
}
