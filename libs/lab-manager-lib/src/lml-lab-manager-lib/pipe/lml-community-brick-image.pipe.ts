import { Pipe, PipeTransform } from '@angular/core';
import { LmlBrickService } from '../lml-brick.service';

@Pipe({
  name: 'lmlCommunityBrickImage',
})
export class LmlCommunityBrickImagePipe implements PipeTransform {
  constructor(private brickService: LmlBrickService) {}

  transform(imageLink: any): string {
    if (imageLink) {
      return this.brickService.getImageUrl(imageLink);
    }
    return 'assets/fl-logo/logo.png';
  }
}
