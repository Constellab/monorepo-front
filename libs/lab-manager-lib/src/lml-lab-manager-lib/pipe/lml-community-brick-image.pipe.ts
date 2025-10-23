import { inject, Pipe, PipeTransform } from '@angular/core';

import { LmlBrickService } from '../lml-brick.service';

@Pipe({
  name: 'lmlCommunityBrickImage',
  standalone: false,
})
export class LmlCommunityBrickImagePipe implements PipeTransform {
  private brickService = inject(LmlBrickService);

  transform(imageLink: any): string {
    if (imageLink) {
      return this.brickService.getImageUrl(imageLink);
    }
    return 'assets/fl-logo/constellab-logo.svg';
  }
}
