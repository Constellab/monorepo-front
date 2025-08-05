import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  TeBlockFigureUploadedResponse,
  TeBlockFileUploadResponse,
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeTools,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { CaConstellabDocumentService } from '../../../ca-core/service-api/ca-constellab-document.service';

class CaDocumentTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private documentId: string,
    private constellabDocumentService: CaConstellabDocumentService,
    private hierarchyObjectToken?: string
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.constellabDocumentService.uploadImageToConstellabDocument(file, this.documentId);
  }

  getImageUrl(filename: string): string {
    return this.constellabDocumentService.getConstellabDocumentFileUrl(
      this.documentId,
      filename,
      this.hierarchyObjectToken
    );
  }
}

export class CaDocumentTextEditorFileConfig implements TeFileBlockConfig {
  constructor(
    private documentId: string,
    private constellabDocumentService: CaConstellabDocumentService,
    private hierarchyObjectToken?: string
  ) {}

  fileUploader(file: File): Observable<TeBlockFileUploadResponse> {
    return this.constellabDocumentService.uploadFileToConstellabDocument(file, this.documentId);
  }

  getFileUrl(filename: string): string {
    return this.constellabDocumentService.getConstellabDocumentFileUrl(
      this.documentId,
      filename,
      this.hierarchyObjectToken
    );
  }
}

export class CaConstellabDocumentTextEditorConfig extends TeCompleteConfig {
  constructor(
    private documentId: string,
    private constellabDocumentService: CaConstellabDocumentService,
    private hierarchyObjectToken?: string
  ) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaDocumentTextEditorImageConfig(
      this.documentId,
      this.constellabDocumentService,
      this.hierarchyObjectToken
    );
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // configure and add the file block
    const fileConfig = new CaDocumentTextEditorFileConfig(
      this.documentId,
      this.constellabDocumentService,
      this.hierarchyObjectToken
    );
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

    return tools;
  }
}
