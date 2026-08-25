import { inject, Pipe, PipeTransform } from '@angular/core';

import { HaBrickService } from '../../../ha-service/ha-brick.service';

@Pipe({ name: 'haBrickImage' })
export class HaBrickImagePipe implements PipeTransform {
  private brickService = inject(HaBrickService);

  transform(imageLink: any): string | null {
    if (imageLink) {
      return this.brickService.getImageUrl(imageLink);
    }
    return null;
  }
}
