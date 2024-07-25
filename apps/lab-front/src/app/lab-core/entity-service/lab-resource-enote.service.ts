import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';
import { PrConfigValues } from '@monorepo/protocol';


/**
 * Service to call methods on enote resource
 */
@Injectable({
  providedIn: 'root'
})
export class LabResourceENoteService {

  private readonly route: string = 'resource-enote';


  constructor(private apiService: FlApiService) {
  }

  public getFilePath(enoteResourceId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${enoteResourceId}/resource/${filename}/file`);
  }

  public callResourceView(enoteResourceId: string, subResourceKey: string,
                          viewMethodName: string, config: PrConfigValues): Observable<LabResourceView> {
    return this.apiService.post(`${this.route}/${enoteResourceId}/resource/${subResourceKey}/views/${viewMethodName}`,
      config, LabResourceView);
  }
}
