import { Injectable } from '@angular/core';
import { FlApiService, flRootInjector } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeFigureBlockConfig, TeUploadedImage } from '@monorepo/text-editor';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';

@Injectable({providedIn: 'root'})
export class LabRichTextService {

  private route: string = 'rich-text';

  constructor(private apiService: FlApiService) {
  }

  public getFilePath(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  uploadImage(file: File): Observable<TeUploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    return this.apiService.post(`${this.route}/image`, formData).pipe(
      map(
        (uploadedFile: any) => {
          return {
            filename: uploadedFile.filename,
            width: uploadedFile.width,
            height: uploadedFile.height,
          };
        }
      )
    );
  }

  getImageUrl(filename: string): string {
    return this.getFilePath(filename);
  }

  getFileView(filename: string): Observable<LabResourceView>{
    return this.apiService.get(`${this.route}/file-view/${filename}`);
  }
}



export class LabRichTextTextEditorImageConfig implements TeFigureBlockConfig {

  private richTextService: LabRichTextService;

  constructor() {
    this.richTextService = flRootInjector.get(LabRichTextService);
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.richTextService.uploadImage(file);
  }

  getImageUrl(filename: string): string {
    return this.richTextService.getImageUrl(filename);
  }
}
