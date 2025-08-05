import { inject,Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import {
  TeAudioTranscriptionConfig,
  TeBlockFigureUploadedResponse,
  TeBlockFileUploadResponse,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeRichText,
  TeRichTextDTO,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LiResourceView } from '../model/entities/resource/li-resource-view.entity';

export enum LiRichTextObjectType {
  NOTE = 'note',
  NOTE_TEMPLATE = 'note_template',
  NOTE_RESOURCE = 'note_resource',
}

@Injectable({ providedIn: 'root' })
export class LiRichTextService {
  private apiService = inject(FlApiService);

  private route: string = 'rich-text';

  uploadImage(
    objectType: LiRichTextObjectType,
    objectId: string,
    file: File
  ): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.apiService.post(`${this.route}/${objectType}/${objectId}/image`, formData);
  }

  getImageUrl(objectType: LiRichTextObjectType, objectId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${objectType}/${objectId}/image/${filename}`);
  }

  uploadFile(
    objectType: LiRichTextObjectType,
    objectId: string,
    file: File
  ): Observable<TeBlockFileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/${objectType}/${objectId}/file`, formData);
  }

  getFileUrl(objectType: LiRichTextObjectType, objectId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${objectType}/${objectId}/file/${filename}`);
  }

  getFileView(
    objectType: LiRichTextObjectType,
    objectId: string,
    filename: string
  ): Observable<LiResourceView> {
    return this.apiService.get(
      `${this.route}/${objectType}/${objectId}/file-view/${filename}`,
      LiResourceView
    );
  }

  transcribeAudio(audio: Blob): Observable<TeRichTextDTO> {
    const formData: FormData = new FormData();
    formData.append('file', audio);
    return this.apiService.post(`${this.route}/transcribe-audio`, formData);
  }
}

export class LiRichTextImageConfig implements TeFigureBlockConfig {
  private richTextService: LiRichTextService;

  constructor(
    private objectType: LiRichTextObjectType,
    private objectId: string
  ) {
    this.richTextService = flRootInjector.get(LiRichTextService);
  }

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.richTextService.uploadImage(this.objectType, this.objectId, file);
  }

  getImageUrl(filename: string): string {
    return this.richTextService.getImageUrl(this.objectType, this.objectId, filename);
  }
}

export class LiRichTextFileConfig implements TeFileBlockConfig {
  private richTextService: LiRichTextService;

  constructor(
    private objectType: LiRichTextObjectType,
    private objectId: string
  ) {
    this.richTextService = flRootInjector.get(LiRichTextService);
  }

  fileUploader(file: File): Observable<TeBlockFileUploadResponse> {
    return this.richTextService.uploadFile(this.objectType, this.objectId, file);
  }

  getFileUrl(filename: string): string {
    return this.richTextService.getFileUrl(this.objectType, this.objectId, filename);
  }
}

export class LiRichTextAudioTranscriptionConfig implements TeAudioTranscriptionConfig {
  private richTextService: LiRichTextService;

  constructor() {
    this.richTextService = flRootInjector.get(LiRichTextService);
  }

  transcribeAudio(audio: Blob): Observable<TeRichText> {
    return this.richTextService.transcribeAudio(audio).pipe(map((richText) => new TeRichText(richText)));
  }
}
