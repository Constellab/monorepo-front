import {TeComponentBlock} from './te-component-block.class';
import {TeVideoComponent} from '../component/te-video/te-video.component';
import {Type} from '@angular/core';
import {ClRichTextVideo} from '@monorepo/core-lib';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';

export class TeVideoBlock extends TeComponentBlock<TeVideoComponent> {

  public static readonly TAG_NAME = 'te-video';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeVideoBlock.translateService.translate('teTextEditor.youtube_video'),
      icon: '<span class="material-icons-outlined">play_arrow</span>',
    };
  }

  getComponentType(): Type<TeVideoComponent> {
    return TeVideoComponent;
  }

  getTagName(): string {
    return TeVideoBlock.TAG_NAME;
  }

  initInputs(data: ClRichTextVideo): void {
    this.componentInstance.videoTitle = data?.title;
    this.componentInstance.caption = data?.caption;
    this.componentInstance.url = data?.url;
  }

  save(): ClRichTextVideo {
    return {
      url: this.componentInstance.url,
      title: this.componentInstance.videoTitle,
      caption: this.componentInstance.caption,
    };
  }

  validate(blockData: ClRichTextVideo): boolean {
    return blockData?.url?.length > 0;
  }

  override appendCallback(): void {
    this.componentInstance.openLinkDialog();
  }
}
