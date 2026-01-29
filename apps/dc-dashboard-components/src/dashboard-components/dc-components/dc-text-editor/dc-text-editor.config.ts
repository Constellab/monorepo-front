import { HttpClient } from '@angular/common/http';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  TeBlockFigureUploadedResponse,
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeTools,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

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
  constructor(private customTools?: TeTools) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    // configure and add the image block
    // const imageConfig = new DcRichTextImageConfig(this.apiUrl, this.imageFolder, this.httpClient);
    // tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    const tools = super.getTools(envInjector, applicationRef);
    const result: TeTools = {};

    // First, add all custom tools, so they are first in the list
    if (this.customTools) {
      for (const key in this.customTools) {
        result[key] = this.customTools[key];
      }
    }

    // Then, add parent tools only if they don't exist
    for (const key in tools) {
      if (!(key in result)) {
        result[key] = tools[key];
      }
    }

    return result;
  }
}
