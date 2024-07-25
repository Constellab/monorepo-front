import { Observable } from 'rxjs';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { Type } from '@angular/core';
import { TeComponentBlock } from './te-component-block.class';
import { TeHelper } from '../model/te.helper';
import { TeFileComponent } from '../component/te-file/te-file.component';
import { PasteEvent } from '@editorjs/editorjs';
import { PasteConfig } from '@editorjs/editorjs/types/configs/paste-config';

export interface TeFileBlockData {
  name: string;
  size: number; // in bytes
}


/**
 * Config for the text editor to manage file (upload and retrieve)
 */
export interface TeFileBlockConfig {

  getFileUrl(filename: string): string;

  fileUploader: (file: File) => Observable<TeFileBlockData>;
}

export class TeFileBlock extends TeComponentBlock<TeFileComponent> {

  public static readonly TAG_NAME = 'te-file';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('teTextEditor.file'),
      icon: TeHelper.getMatIconElement('description'),
    };
  }

  static override get pasteConfig(): PasteConfig {
    return {
      files: {
        mimeTypes: ['application/*', 'audio/*', 'video/*'],
      },
    };

  }

  get fileConfig(): TeFileBlockConfig {
    return this.additionalData;
  }

  getComponentType(): Type<TeFileComponent> {
    return TeFileComponent;
  }

  getTagName(): string {
    return TeFileBlock.TAG_NAME;
  }

  initInputs(data: TeFileBlockData): void {
    this.componentInstance.data = data;
    this.componentInstance.config = this.fileConfig;
  }

  save(): TeFileBlockData {
    return this.componentInstance.data;
  }


  override blockClasses(): string[] {
    return [];
  }

  // ignore the block if it is empty
  validate(blockData: TeFileBlockData): boolean {
    return blockData?.name?.length > 0;
  }

  onPaste(event: PasteEvent): void {
    // if a file is pasted, we will get the file here
    if (event.type === 'file') {
      console.log('file pasted', event.detail);
      this.componentInstance.onFileSelected((event.detail as any).file);
    }
  }


}
