import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';
import {
  TeAudioTranscriptionConfig,
  TeBlockFigureUploadedResponse,
  TeBlockFileUploadResponse,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeRichText,
  TeRichTextDTO,
} from '@monorepo/text-editor';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';
import { map } from 'rxjs/operators';

export enum LabRichTextObjectType {
  NOTE = 'note',
  NOTE_TEMPLATE = 'note_template',
  NOTE_RESOURCE = 'note_resource',
}

@Injectable({ providedIn: 'root' })
export class LabRichTextService {
  private apiService = inject(FlApiService);

  private route: string = 'rich-text';

  uploadImage(
    objectType: LabRichTextObjectType,
    objectId: string,
    file: File
  ): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.apiService.post(`${this.route}/${objectType}/${objectId}/image`, formData);
  }

  getImageUrl(objectType: LabRichTextObjectType, objectId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${objectType}/${objectId}/image/${filename}`);
  }

  uploadFile(
    objectType: LabRichTextObjectType,
    objectId: string,
    file: File
  ): Observable<TeBlockFileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/${objectType}/${objectId}/file`, formData);
  }

  getFileUrl(objectType: LabRichTextObjectType, objectId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${objectType}/${objectId}/file/${filename}`);
  }

  getFileView(
    objectType: LabRichTextObjectType,
    objectId: string,
    filename: string
  ): Observable<LabResourceView> {
    return this.apiService.get(
      `${this.route}/${objectType}/${objectId}/file-view/${filename}`,
      LabResourceView
    );
  }

  transcribeAudio(audio: Blob): Observable<TeRichTextDTO> {
    const formData: FormData = new FormData();
    formData.append('file', audio);
    return this.apiService.post(`${this.route}/transcribe-audio`, formData);
  }
}

export class LabRichTextImageConfig implements TeFigureBlockConfig {
  private richTextService: LabRichTextService;

  constructor(
    private objectType: LabRichTextObjectType,
    private objectId: string
  ) {
    this.richTextService = flRootInjector.get(LabRichTextService);
  }

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.richTextService.uploadImage(this.objectType, this.objectId, file);
  }

  getImageUrl(filename: string): string {
    return this.richTextService.getImageUrl(this.objectType, this.objectId, filename);
  }
}

export class LabRichTextFileConfig implements TeFileBlockConfig {
  private richTextService: LabRichTextService;

  constructor(
    private objectType: LabRichTextObjectType,
    private objectId: string
  ) {
    this.richTextService = flRootInjector.get(LabRichTextService);
  }

  fileUploader(file: File): Observable<TeBlockFileUploadResponse> {
    return this.richTextService.uploadFile(this.objectType, this.objectId, file);
  }

  getFileUrl(filename: string): string {
    return this.richTextService.getFileUrl(this.objectType, this.objectId, filename);
  }
}

export class LabRichTextAudioTranscriptionConfig implements TeAudioTranscriptionConfig {
  private richTextService: LabRichTextService;

  constructor() {
    this.richTextService = flRootInjector.get(LabRichTextService);
  }

  transcribeAudio(audio: Blob): Observable<TeRichText> {
    return this.richTextService.transcribeAudio(audio).pipe(map((richText) => new TeRichText(richText)));
  }
}
