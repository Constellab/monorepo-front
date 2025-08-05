import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  TeBlockFigureUploadedResponse,
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeTools,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';

export class CaFolderDescriptionTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private folderId: string,
    private folderService: CaFolderService
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.folderService.uploadDescriptionImage(this.folderId, file);
  }

  getImageUrl(filename: string): string {
    return this.folderService.getDescriptionImageUrl(this.folderId, filename);
  }
}

/**
 * Config for the text editor in the note to support view in the editor
 */
export class CaFolderDescriptionTextEditorConfig extends TeCompleteConfig {
  constructor(
    private folderId: string,
    private folderService: CaFolderService
  ) {
    super({ includeToolbarButton: true });
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaFolderDescriptionTextEditorImageConfig(this.folderId, this.folderService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    return tools;
  }
}
