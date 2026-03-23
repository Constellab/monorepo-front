import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { ClStringHelper } from '@monorepo/core-lib';
import {
  TeBlockFigureUploadedResponse,
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeRichText,
  TeTools,
} from '@monorepo/text-editor';
import { map, Observable } from 'rxjs';

import { HaFile } from '../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaDocumentationService } from '../../ha-core/ha-service/ha-documentation.service';
import { HaDocContentViewBlock } from './ha-doc-view/ha-doc-content-view.class';

export class HaDocTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private docId: string,
    private docService: HaDocumentationService
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.docService.uploadImage(file, this.docId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename) ? filename : this.docService.getImageUrl(this.docId, filename);
  }
}

export class HaDocTextEditorFileConfig implements TeFileBlockConfig {
  constructor(
    private docId: string,
    private docService: HaDocumentationService
  ) {}

  fileUploader(file: File): Observable<HaFile> {
    return this.docService.uploadFile(file, this.docId);
  }

  getFileUrl(filename: string): string {
    return this.docService.getDocFilePath(this.docId, filename);
  }
}

/**
 * Config for the text editor in the document page
 */
export class HaDocTextEditorConfig extends TeCompleteConfig {
  constructor(
    private docService: HaDocumentationService,
    private docId: string
  ) {
    super();
    this.figureConfig = new HaDocTextEditorImageConfig(docId, docService);
  }

  override refreshContent$(): Observable<TeRichText> {
    return this.docService.getById(this.docId).pipe(map((doc) => doc.content));
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    tools.figure = this.getImageConfig(this.figureConfig, envInjector, applicationRef);

    // configure and add the file block
    const fileConfig = new HaDocTextEditorFileConfig(this.docId, this.docService);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

    // add the view block
    tools.resourceView = teComponentBlockFactory(
      HaDocContentViewBlock,
      envInjector,
      applicationRef,
      this.docId
    );

    return tools;
  }
}
