import {HaDocumentationService} from '../../../ha-core/ha-service/ha-documentation.service';
import {TeCompleteConfig, TeFigureBlockConfig, TeTools, TeUploadedImage} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {Observable} from 'rxjs';
import {ClStringHelper} from '@monorepo/core-lib';

export class HaDocTextEditorImageConfig implements TeFigureBlockConfig {


  constructor(private docId: string,
              private docService: HaDocumentationService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.docService.uploadImage(file, this.docId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename) ? filename : this.docService.getImageUrl(filename);
  }
}

/**
 * Config for the text editor in the document page
 */
export class HaDocTextEditorConfig extends TeCompleteConfig {

  constructor(private brickName: string,
              private major: string,
              private documentationName: string,
              private docService: HaDocumentationService,
              private docId: string) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new HaDocTextEditorImageConfig(this.docId, this.docService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    return tools;
  }
}
