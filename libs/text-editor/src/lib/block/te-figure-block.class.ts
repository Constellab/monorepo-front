import { TeComponentBlock } from './te-component-block.class';
import { TeFigureComponent } from '../component/te-figure/te-figure.component';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { PasteConfig } from '@editorjs/editorjs/types/configs/paste-config';
import { PasteEvent } from '@editorjs/editorjs';
import { TeHelper } from '../model/te.helper';
import { TeBlockFigureData, TeBlockFigureUploadedResponse } from '../model/lib';

/**
 * Config for the text editor to manage image (upload and retrieve)
 */
export interface TeFigureBlockConfig {
  getImageUrl(filename: string): string;

  imageUploader: (file: File) => Observable<TeBlockFigureUploadedResponse>;
}

/**
 * Figure block for editor js
 */
export class TeFigureBlock extends TeComponentBlock<TeFigureComponent> {
  public static readonly TAG_NAME = 'te-figure';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('teTextEditor.image'),
      icon: TeHelper.getMatIconElement('image'),
    };
  }

  static override get pasteConfig(): PasteConfig {
    return {
      // tags: ['img'], // uncomment to support pasting image from html page
      files: {
        mimeTypes: ['image/*'],
      },
    };
  }

  get figureConfig(): TeFigureBlockConfig {
    return this.additionalData;
  }

  getComponentType(): Type<TeFigureComponent> {
    return TeFigureComponent;
  }

  getTagName(): string {
    return TeFigureBlock.TAG_NAME;
  }

  initInputs(data: TeBlockFigureData): void {
    this.componentInstance.data = data;
    this.componentInstance.config = this.figureConfig;
  }

  save(): TeBlockFigureData {
    return this.componentInstance.data;
  }

  // ignore the formula if it is empty
  validate(blockData: TeBlockFigureData): boolean {
    return blockData?.filename?.length > 0;
  }

  onPaste(event: PasteEvent): void {
    // if a file image is pasted (like a screenshot), we will get the file here
    if (event.type === 'file') {
      this.componentInstance.onFileSelected((event.detail as any).file);
    }
  }
}
