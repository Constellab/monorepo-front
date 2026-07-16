import { HttpClient } from '@angular/common/http';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import {
  TeBlockFigureUploadedResponse,
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeTools,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { DcEnvironmentHelper } from '../../dc-core/dc-environment.helper';

/**
 * Image config of the rich text. It identifies the object owning the rich text (ex: 'note',
 * 'project_document'). When it is set, the image block is enabled and the images are uploaded
 * and loaded through the lab rich text API, in a directory dedicated to that object.
 */
export interface DcRichTextImageObject {
  objectType: string;
  objectId: string;
}

/**
 * Image config of the text editor. It uploads and loads the images through the lab rich text
 * API, in a directory dedicated to the object owning the rich text.
 *
 * The requests are authenticated by DcHttpInterceptorService which adds the app headers to the
 * HttpClient requests, so the app token of the component is used. This is why the requests must
 * go through HttpClient (and with an absolute url), and not through DcHttpService which only
 * sends json bodies.
 */
export class DcRichTextImageConfig implements TeFigureBlockConfig {
  constructor(
    private imageConfig: DcRichTextImageObject,
    private httpClient: HttpClient
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.httpClient.post(this.getImageRouteUrl(), formData) as any;
  }

  getImageUrl(filename: string): string {
    return `${this.getImageRouteUrl()}/${filename}`;
  }

  private getImageRouteUrl(): string {
    const { objectType, objectId } = this.imageConfig;
    // getCoreApiUrl ends with a '/'
    return `${DcEnvironmentHelper.getCoreApiUrl()}rich-text/${objectType}/${objectId}/image`;
  }
}

export class DcTextEditorConfig extends TeCompleteConfig {
  constructor(
    private httpClient: HttpClient,
    private customTools?: TeTools,
    private imageConfig?: DcRichTextImageObject
  ) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);
    const result: TeTools = {};

    // configure and add the image block. It is only available if the rich text is linked to an
    // object, because the images are stored in a directory dedicated to that object.
    if (this.imageConfig?.objectType && this.imageConfig?.objectId) {
      const imageConfig = new DcRichTextImageConfig(this.imageConfig, this.httpClient);
      result.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);
    }

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
