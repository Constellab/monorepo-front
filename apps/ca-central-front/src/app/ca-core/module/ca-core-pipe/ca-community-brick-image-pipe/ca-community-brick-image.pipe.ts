import { Pipe, PipeTransform, inject } from '@angular/core';
import { CaCommunityBrickService } from '../../../service-api/ca-community-brick.service';

@Pipe({ name: 'caCommunityBrickImage' })
export class CaCommunityBrickImagePipe implements PipeTransform {
  private communityBrickService = inject(CaCommunityBrickService);

  transform(imageLink: any): string {
    if (imageLink) {
      return this.communityBrickService.getImageUrl(imageLink);
    }
    return 'assets/fl-logo/logo.png';
  }
}
