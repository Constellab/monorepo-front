import {TeComponentBlock} from './te-component-block.class';
import {TeFigureComponent} from '../component/te-figure/te-figure.component';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {Type} from '@angular/core';
import {ClRichTextFigure} from '@monorepo/core-lib';
import {Observable} from 'rxjs';

export interface TeUploadedImage {
  filename: string;
  width: number;
  height: number;
}


/**
 * Config for the text editor to retrieve the image from their names
 */
export interface TeFigureBlockConfig {

  getImageUrl(filename: string): string;

  imageUploader: (file: File) => Observable<TeUploadedImage>;
}


/**
 * Formula block for editor js
 */
export class TeFigureBlock extends TeComponentBlock<TeFigureComponent> {

  public static readonly TAG_NAME = 'te-figure';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeFigureBlock.translateService.translate('teTextEditor.image'),
      icon: '<span class="material-icons-outlined">image</span>',
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

  initInputs(data: ClRichTextFigure): void {
    this.componentInstance.data = data;
    this.componentInstance.config = this.figureConfig;
  }

  save(): ClRichTextFigure {
    return this.componentInstance.data;
  }

  // ignore the formula if it is empty
  validate(blockData: ClRichTextFigure): boolean {
    return blockData?.filename?.length > 0;
  }

  // override appendCallback(): void {
  //   window.open('file:///');
  // }
}
