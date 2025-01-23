import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';
import { PrConfigValues } from '@monorepo/protocol';

/**
 * Service to call methods on note resource resource
 */
@Injectable({
  providedIn: 'root',
})
export class LabNoteResourceService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'note-resource';

  public getFilePath(noteResourceId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${noteResourceId}/resource/${filename}/file`);
  }

  public callResourceView(
    noteResourceId: string,
    subResourceKey: string,
    viewMethodName: string,
    config: PrConfigValues
  ): Observable<LabResourceView> {
    return this.apiService.post(
      `${this.route}/${noteResourceId}/resource/${subResourceKey}/views/${viewMethodName}`,
      config,
      LabResourceView
    );
  }
}
