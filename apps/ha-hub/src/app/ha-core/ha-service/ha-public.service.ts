import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';

@Injectable({
  providedIn: 'root',
})
export class HaPublicService {
  private readonly route: string = 'public';

  constructor(private apiService: FlApiService) {}

  public getVideo(videoFileName: string): string {
    return this.apiService.getBaseRouteUrl(this.route + '/video/' + videoFileName);
  }
}
