import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { CaResource } from '../model/entities/folder/ca-resource.class';

@Injectable({
  providedIn: 'root',
})
export class CaResourceService {
  private readonly route: string = 'resources';

  constructor(private apiService: FlApiService) {}

  public findById(id: string): Observable<CaResource> {
    return this.apiService.get(`${this.route}/${id}`, CaResource);
  }

  public deleteById(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public renameResource(id: string, name: string): Observable<CaResource> {
    return this.apiService.put(`${this.route}/${id}/name`, { name }, CaResource);
  }
}
