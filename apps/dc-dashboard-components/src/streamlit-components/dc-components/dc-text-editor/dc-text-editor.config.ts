import {
  TeBlockFigureUploadedResponse,
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeTools,
} from '@monorepo/text-editor';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class DcRichTextImageConfig implements TeFigureBlockConfig {
  constructor(
    private apiUrl: string,
    private imageFolder: string,
    private httpClient: HttpClient
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('dir', this.imageFolder);
    return this.httpClient.post(`${this.apiUrl}/core-api/streamlit/rich-text/image`, formData) as any;
  }

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/core-api/streamlit/rich-text/image/${this.imageFolder}/${filename}`;
  }
}

export class DcTextEditorConfig extends TeCompleteConfig {
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    // configure and add the image block
    // const imageConfig = new DcRichTextImageConfig(this.apiUrl, this.imageFolder, this.httpClient);
    // tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    return super.getTools(envInjector, applicationRef);
  }
}
