import {
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeFileBlockData,
  TeTools,
  TeUploadedImage,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';

export class CaDocumentTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private documentId: string,
    private folderService: CaFolderService
  ) {}

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.folderService.uploadImageToConstellabDocument(file, this.documentId);
  }

  getImageUrl(filename: string): string {
    return this.folderService.getConstellabDocumentFileUrl(this.documentId, filename);
  }
}

export class CaDocumentTextEditorFileConfig implements TeFileBlockConfig {
  constructor(
    private documentId: string,
    private folderService: CaFolderService
  ) {}

  fileUploader(file: File): Observable<TeFileBlockData> {
    return this.folderService.uploadFileToConstellabDocument(file, this.documentId);
  }

  getFileUrl(filename: string): string {
    return this.folderService.getConstellabDocumentFileUrl(this.documentId, filename);
  }
}

export class CaDocumentTextEditorConfig extends TeCompleteConfig {
  constructor(
    private documentId: string,
    private folderService: CaFolderService
  ) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaDocumentTextEditorImageConfig(this.documentId, this.folderService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // configure and add the file block
    const fileConfig = new CaDocumentTextEditorFileConfig(this.documentId, this.folderService);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

    return tools;
  }
}
