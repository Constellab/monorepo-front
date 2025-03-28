import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Injectable, inject } from '@angular/core';
import { LiFolder, LiFolderWithChildren } from '../model/entities/li-folder.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiFolderService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'space-folder';

  public synchronizeFolders(): Observable<void> {
    return this.apiService.post(`${this.route}/synchronize`, LiFolder);
  }

  public getFolderTrees(): Observable<LiFolderWithChildren[]> {
    return this.apiService.get(`${this.route}/trees`, LiFolderWithChildren);
  }

  public getFolder(id: string): Observable<LiFolder> {
    return this.apiService.get(`${this.route}/${id}`, LiFolder);
  }
}
