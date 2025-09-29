import { inject, Pipe, PipeTransform } from '@angular/core';

import { HaCommunityAppService } from '../../../ha-service/ha-community-app.service';

@Pipe({ name: 'haAppPicture' })
export class HaAppPicturePipe implements PipeTransform {
  private communityAppService = inject(HaCommunityAppService);

  transform(picture: string): any {
    if (picture) {
      return this.communityAppService.getAppPictureUrl(picture);
    }
    return null;
  }
}
