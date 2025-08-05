import { inject,Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { LiResourceView } from '../model/entities/resource/li-resource-view.entity';

/**
 * Service to call methods on note resource
 */
@Injectable({
  providedIn: 'root',
})
export class LiNoteResourceService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'note-resource';

  public getFilePath(noteResourceId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${noteResourceId}/resource/${filename}/file`);
  }

  public callResourceView(
    noteResourceId: string,
    subResourceKey: string,
    viewMethodName: string,
    config: TdParamSpecsValues
  ): Observable<LiResourceView> {
    return this.apiService.post(
      `${this.route}/${noteResourceId}/resource/${subResourceKey}/views/${viewMethodName}`,
      config,
      LiResourceView
    );
  }
}
