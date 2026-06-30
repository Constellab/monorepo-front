import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { Observable, tap } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { LiScenario, LiScenarioWithOutputResource } from '../model/entities/li-scenario.entity';
import { LiTypeEntity } from '../model/entities/li-type/li-type.entity';
import { LiResource } from '../model/entities/resource/li-resource.entity';
import { LiResourceView } from '../model/entities/resource/li-resource-view.entity';
import { LiScenarioService } from './li-scenario.service';

@Injectable({
  providedIn: 'root',
})
export class LiFileResourceService {
  private apiService = inject(FlApiService);
  private scenarioService = inject(LiScenarioService);

  public static readonly uploadFileActon = 'uploadFile';

  // extraction is usually quick, poll with a shorter interval
  private static readonly fastPollIntervalMs: number = 3000;

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

  public extractNode(id: string, subPath: string, typingName: string): Observable<LiResource> {
    // the route returns the created scenario immediately, then runs
    // asynchronously: poll it until it produces its output resource
    return this.apiService
      .put(
        `${this.route}/${id}/folder/extract-node`,
        {
          path: subPath,
          fs_node_typing_name: typingName,
        },
        LiScenario
      )
      .pipe(
        switchMap((scenario: LiScenario) =>
          this.scenarioService.pollScenarioOutputResource(
            scenario.id,
            LiFileResourceService.fastPollIntervalMs
          )
        ),
        map((result: LiScenarioWithOutputResource) => result.outputResource)
      );
  }

  public callFolderSubFileView(id: string, subFilePath: string): Observable<LiResourceView> {
    return this.apiService.post(
      `${this.route}/${id}/folder/sub-file-view`,
      { sub_file_path: subFilePath },
      LiResourceView
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

  public renameFolderSubNode(id: string, subPath: string, newName: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/folder/rename-sub-node`, {
      sub_node_path: subPath,
      new_name: newName,
    });
  }

  public deleteFolderSubNode(id: string, subPath: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/folder/delete-sub-node`, {
      sub_file_path: subPath,
    });
  }

  //////////////////////////////////////////// FILE TYPE ////////////////////////////////////////
  // return the list of all file types
  public getFileTypes(): Observable<LiTypeEntity[]> {
    return this.apiService.get(`${this.route}/file-type`, LiTypeEntity);
  }

  // return the list of all folder types
  public getFolderTypes(): Observable<LiTypeEntity[]> {
    return this.apiService.get(`${this.route}/folder-type`, LiTypeEntity);
  }
}
