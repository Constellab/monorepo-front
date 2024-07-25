import {
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeFileBlockData,
  TeTools,
  TeUploadedImage
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { CaProjectService } from '../../../ca-core/service-api/ca-project.service';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';

export class CaDocumentTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private documentId: string,
              private projectService: CaProjectService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.projectService.uploadImageToConstellabDocument(file, this.documentId);
  }

  getImageUrl(filename: string): string {
    return this.projectService.getConstellabDocumentFileUrl(this.documentId, filename);
  }
}

export class CaDocumentTextEditorFileConfig implements TeFileBlockConfig {

  constructor(private documentId: string,
              private projectService: CaProjectService) {
  }

  fileUploader(file: File): Observable<TeFileBlockData> {
    return this.projectService.uploadFileToConstellabDocument(file, this.documentId);
  }

  getFileUrl(filename: string): string {
    return this.projectService.getConstellabDocumentFileUrl(this.documentId, filename);
  }
}


export class CaDocumentTextEditorConfig2 extends TeCompleteConfig {

  constructor(private documentId: string,
              private projectService: CaProjectService) {
    super();
  }


  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaDocumentTextEditorImageConfig(
      this.documentId, this.projectService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // configure and add the file block
    const fileConfig = new CaDocumentTextEditorFileConfig(
      this.documentId, this.projectService);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

    return tools;
  }
}
