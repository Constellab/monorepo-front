import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabFolder, LabFolderWithChildren } from '../model/entities/lab-folder.class';

@Injectable({
  providedIn: 'root',
})
export class LabFolderService {
  private readonly route: string = 'space-folder';

  constructor(private apiService: FlApiService) {}

  public synchronizeFolders(): Observable<void> {
    return this.apiService.post(`${this.route}/synchronize`, LabFolder);
  }

  public getFolderTrees(): Observable<LabFolderWithChildren[]> {
    return this.apiService.get(`${this.route}/trees`, LabFolderWithChildren);
  }
}
