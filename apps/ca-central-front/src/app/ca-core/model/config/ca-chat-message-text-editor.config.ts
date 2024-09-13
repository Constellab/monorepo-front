import { ClPageI } from '@monorepo/core-lib';
import { CaFolderService } from '../../service-api/ca-folder.service';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { Observable } from 'rxjs';
import { CaUser } from '../entities/ca-user.class';
import {
  TeAdditionalConfig,
  TeCleanStyleInlineTool,
  TeComponentInitData,
  TeConfig,
  TeEvent,
  TeFakeInlineTool,
  TeFigureBlockConfig,
  TeStrikethroughInlineTool,
  TeTools,
  TeUnderlineInlineTool,
  TeUploadedImage
} from '@monorepo/text-editor';


export class CaChatMessageTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private folderId: string,
              private folderService: CaFolderService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.folderService.uploadMessageImage(file, this.folderId);
  }

  getImageUrl(filename: string): string {
    return this.folderService.getMessageImageUrl(filename, this.folderId);
  }


}

/**
 * Config for the text editor in the report to support view in the editor
 */
export class CaChatMessageTextEditorConfig extends TeConfig {

  public event: TeEvent = new TeEvent();

  constructor(private folderId: string,
              private folderService: CaFolderService,
              private mode: 'create' | 'update' = 'create') {
    super({
      hideToolbar: true,
      dense: true
    });
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector,
           applicationRef: ApplicationRef): TeTools {

    // configure and add the image block
    const imageConfig = new CaChatMessageTextEditorImageConfig(this.folderId, this.folderService);

    const config = {
      paragraph: this.getParagraphConfig(),
      list: this.getListConfig(),
      figure: this.getImageConfig(imageConfig, envInjector, applicationRef),

      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      inlineCode: this.getInlineCodeConfig(),
      cleanStyle: TeCleanStyleInlineTool,
      fake: TeFakeInlineTool
    };

    // only enable mention on create mode
    if (this.mode === 'create') {
      (config as any).mention = this.getMentionConfig();
    }

    return config;
  }


  getAdditionalConfig(): TeAdditionalConfig {
    return {
      emoji: true,
      mention: {
        getUsers: (name, page, pageSize) => this.getUsers(name, page, pageSize)
      }
    };
  }

  private getUsers(name: string, page: number, pageSize: number): Observable<ClPageI<CaUser>> {
    return this.folderService.searchFolderUser(this.folderId, name, page, pageSize);
  }

  getTunes(): string[] {
    return [];
  }

  getInlineToolbar(): string[] {
    const toolbar = this.getFullInlineToolbar(false);
    if (this.mode === 'create') {
      toolbar.push('mention');
    }
    return toolbar;
  }

  addFigureBlock(): void {

    this.event.addEvent({
      type: 'insertBlock',
      blockType: 'figure',
      data: {
        forceNewElement: true
      } as TeComponentInitData
    });
  }

}
