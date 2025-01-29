import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { Observable, tap } from 'rxjs';
import { LabResource } from '../model/entities/resource/lab-resource.entity';
import { HttpEvent } from '@angular/common/http';
import { LabTypeEntity } from '../model/entities/lab-type/lab-type.entity';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';

@Injectable({
  providedIn: 'root',
})
export class LabFileResourceService {
  private apiService = inject(FlApiService);

  public static readonly uploadFileActon = 'uploadFile';

  private readonly route: string = 'fs-node';

  /**
   * Upload a file to the serveur. This watch the http events to follow progress.
   */
  public uploadFile(file: File, typingName?: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('typing_name', typingName);

    return this.apiService.post(`${this.route}/upload-file`, formData, null, {
      observe: 'events',
      reportProgress: true,
    });
  }

  /**
   * Upload a folder to the serveur. This watch the http events to follow progress.
   */
  public uploadFolder(folderTypingName: string, files: File[]): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.apiService.post(`${this.route}/upload-folder/${folderTypingName}`, formData, null, {
      observe: 'events',
      reportProgress: true,
    });
  }

  public downloadFile(id: string): void {
    // download the file from the url
    FlFileHelper.downloadUrl(this.getDownloadFileUrl(id));
  }

  public getDownloadFileUrl(id: string): string {
    return this.apiService.getBaseRouteUrl(`fs-node/${id}/download`);
  }

  //////////////////////////// FOLDER ROUTES ///////////////////////////////////////

  public extractNode(id: string, subPath: string, typingName: string): Observable<LabResource> {
    return this.apiService.put(
      `${this.route}/${id}/folder/extract-node`,
      {
        path: subPath,
        fs_node_typing_name: typingName,
      },
      LabResource
    );
  }

  public callFolderSubFileView(id: string, subFilePath: string): Observable<LabResourceView> {
    return this.apiService.post(
      `${this.route}/${id}/folder/sub-file-view`,
      { sub_file_path: subFilePath },
      LabResourceView
    );
  }

  public downloadFolderSubFile(id: string, subFilePath: string): Observable<any> {
    return this.apiService
      .post(`${this.route}/${id}/folder/download-sub-node`, { sub_file_path: subFilePath }, null, {
        responseType: 'blob',
      })
      .pipe(
        tap((blob) => FlFileHelper.downloadBlob(blob, FlFileHelper.extractFilenameFromFullPath(subFilePath)))
      );
  }

  //////////////////////////////////////////// FILE TYPE ////////////////////////////////////////
  // return the list of all file types
  public getFileTypes(): Observable<LabTypeEntity[]> {
    return this.apiService.get(`${this.route}/file-type`, LabTypeEntity);
  }

  // return the list of all folder types
  public getFolderTypes(): Observable<LabTypeEntity[]> {
    return this.apiService.get(`${this.route}/folder-type`, LabTypeEntity);
  }
}
