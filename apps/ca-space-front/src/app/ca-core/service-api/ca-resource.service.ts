import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { CaResource } from '../model/entities/folder/ca-resource.class';

@Injectable({
  providedIn: 'root',
})
export class CaResourceService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'resources';

  public findById(id: string): Observable<CaResource> {
    return this.apiService.get(`${this.route}/${id}`, CaResource);
  }

  public renameResource(id: string, name: string): Observable<CaResource> {
    return this.apiService.put(`${this.route}/${id}/name`, { name }, CaResource);
  }

  /**
   * Build the full backend url that redirects (302) to the resource access url.
   */
  public getRedirectUrl(id: string): string {
    return this.apiService.getUrlForId(`${this.route}/{id}/redirect`, id);
  }
}
