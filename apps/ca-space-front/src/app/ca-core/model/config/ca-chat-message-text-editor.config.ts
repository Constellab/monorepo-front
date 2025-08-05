import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlDatasourceGetPageData } from '@monorepo/front-core-lib/fl-core';
import {
  TeAdditionalConfig,
  TeBlockFigureUploadedResponse,
  TeCleanStyleInlineTool,
  TeComponentInitData,
  TeConfig,
  TeEvent,
  TeFakeInlineTool,
  TeFigureBlockConfig,
  TeMentionSearchFilter,
  TeStrikethroughInlineTool,
  TeTools,
  TeUnderlineInlineTool,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { CaChatService } from '../../service-api/ca-chat.service';
import { CaFolderService } from '../../service-api/ca-folder.service';
import { CaUser } from '../entities/ca-user.class';

class CaChatMessageTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private folderId: string,
    private chatService: CaChatService
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.chatService.uploadMessageImage(file, this.folderId);
  }

  getImageUrl(filename: string): string {
    return this.chatService.getMessageImageUrl(filename, this.folderId);
  }
}

/**
 * Config for the text editor in the note to support view in the editor
 */
export class CaChatMessageTextEditorConfig extends TeConfig {
  public event: TeEvent = new TeEvent();

  constructor(
    public folderId: string,
    private chatService: CaChatService,
    private folderService: CaFolderService,
    private mode: 'create' | 'update' = 'create'
  ) {
    super({
      hideToolbar: true,
      dense: true,
    });
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    // configure and add the image block
    const imageConfig = new CaChatMessageTextEditorImageConfig(this.folderId, this.chatService);

    const config = {
      paragraph: this.getParagraphConfig(),
      list: this.getListConfig(),
      figure: this.getImageConfig(imageConfig, envInjector, applicationRef),

      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      inlineCode: this.getInlineCodeConfig(),
      cleanStyle: TeCleanStyleInlineTool,
      fake: TeFakeInlineTool,
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
        getUsers: (data, page, pageSize) => this.getUsers(data, page, pageSize),
      },
    };
  }

  private getUsers(
    data: FlDatasourceGetPageData<TeMentionSearchFilter>,
    page: number,
    pageSize: number
  ): Observable<ClPageI<CaUser>> {
    return this.folderService.searchFolderUser(this.folderId, data.filtersCriteria.text, page, pageSize);
  }

  getTunes(): string[] {
    return ['moveUp', 'moveDown', 'delete'];
  }

  getInlineToolbar(): string[] {
    const toolbar = this.getBasicInlineToolbar();
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
        forceNewElement: true,
      } as TeComponentInitData,
    });
  }
}
