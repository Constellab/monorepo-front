import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeTools,
  TeUploadedImage
} from '@monorepo/text-editor';
import {Observable} from 'rxjs';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaStoryContentViewBlock} from '../ha-story-view/ha-story-content-view.class';


export class HaStoryTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private storyId: string,
              private storyService: HaStoryService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.storyService.uploadImage(file, this.storyId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename) ? filename : this.storyService.getImageUrl(filename);
  }
}

/**
 * Config for the text editor in story pages
 */
export class HaStoryTextEditorConfig extends TeCompleteConfig {
  constructor(private storyService: HaStoryService,
              private storyId: string) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new HaStoryTextEditorImageConfig(this.storyId, this.storyService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // add the view block
    tools.resourceView = teComponentBlockFactory(HaStoryContentViewBlock, envInjector, applicationRef, this.storyId);

    return tools;
  }
}
