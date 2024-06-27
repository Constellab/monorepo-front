import {HaDocumentationService} from '../../../ha-core/ha-service/ha-documentation.service';
import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeTools,
  TeUploadedImage
} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {Observable} from 'rxjs';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaDocContentViewBlock} from './ha-doc-view/ha-doc-content-view.class';
import {HaFile} from '../../../ha-core/entity-module/ha-file-core/model/ha-file';

export class HaDocTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private docId: string,
              private docService: HaDocumentationService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.docService.uploadImage(file, this.docId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename) ? filename : this.docService.getImageUrl(this.docId, filename);
  }
}

export class HaDocTextEditorFileConfig implements TeFileBlockConfig {

  constructor(private docId: string,
              private docService: HaDocumentationService) {
  }

  fileUploader(file: File): Observable<HaFile> {
    return this.docService.uploadFile(file, this.docId);
  }

  getFileUrl(file: HaFile): string {
    return this.docService.getDocFilePath(this.docId, file.name);
  }
}

/**
 * Config for the text editor in the document page
 */
export class HaDocTextEditorConfig extends TeCompleteConfig {

  constructor(private docService: HaDocumentationService,
              private docId: string) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new HaDocTextEditorImageConfig(this.docId, this.docService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    // configure and add the file block
    const fileConfig = new HaDocTextEditorFileConfig(
      this.docId, this.docService);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

    // add the view block
    tools.resourceView = teComponentBlockFactory(HaDocContentViewBlock, envInjector, applicationRef, this.docId);

    return tools;
  }
}
