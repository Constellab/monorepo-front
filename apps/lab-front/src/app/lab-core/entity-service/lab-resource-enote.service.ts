import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';


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
    return this.apiService.getBaseRouteUrl(`${this.route}/${enoteResourceId}/image/${filename}`);
  }
}
