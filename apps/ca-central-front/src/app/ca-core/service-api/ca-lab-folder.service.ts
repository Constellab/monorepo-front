import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FlApiService } from '@monorepo/front-core-lib';
import { CaLabFolder } from '../model/entities/lab/ca-lab-folder.class';

@Injectable({
  providedIn: 'root',
})
export class CaLabFolderService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'lab-folder';

  public addFolderToLab(labId: string, folderId: string): Observable<CaLabFolder> {
    return this.apiService.post(`${this.route}/${labId}/folder/${folderId}`, null, CaLabFolder);
  }

  public removeFolderFromLab(labId: string, folderId: string): Observable<CaLabFolder> {
    return this.apiService.delete(`${this.route}/${labId}/folder/${folderId}`, CaLabFolder);
  }

  public getLabFolders(labId: string): Observable<CaLabFolder[]> {
    return this.apiService.get(`${this.route}/${labId}/folder`, CaLabFolder);
  }

  public syncLabFolder(labId: string, folderId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${labId}/folder/${folderId}/sync`, null);
  }
}
