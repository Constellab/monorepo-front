import { TeComponentBlock } from './te-component-block.class';
import { TeVideoComponent } from '../component/te-video/te-video.component';
import { Type } from '@angular/core';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { TeHelper } from '../model/te.helper';

export class TeVideoBlockData {
  url: string;
  title?: string;
  caption?: string;
}

export class TeVideoBlock extends TeComponentBlock<TeVideoComponent> {
  public static readonly TAG_NAME = 'te-video';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('teTextEditor.youtube_video'),
      icon: TeHelper.getMatIconElement('play_arrow'),
    };
  }

  getComponentType(): Type<TeVideoComponent> {
    return TeVideoComponent;
  }

  getTagName(): string {
    return TeVideoBlock.TAG_NAME;
  }

  initInputs(data: TeVideoBlockData): void {
    this.componentInstance.videoTitle = data?.title;
    this.componentInstance.caption = data?.caption;
    this.componentInstance.url = data?.url;
  }

  save(): TeVideoBlockData {
    return {
      url: this.componentInstance.url,
      title: this.componentInstance.videoTitle,
      caption: this.componentInstance.caption,
    };
  }

  validate(blockData: TeVideoBlockData): boolean {
    return blockData?.url?.length > 0;
  }

  override appendCallback(): void {
    this.componentInstance.openLinkDialog();
  }
}
