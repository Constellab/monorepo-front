import { Pipe, PipeTransform } from '@angular/core';
import { HaBrickService } from '../../../ha-service/ha-brick.service';

@Pipe({
    name: 'haBrickImage',
    standalone: false
})
export class HaBrickImagePipe implements PipeTransform {
  constructor(private brickService: HaBrickService) {}

  transform(imageLink: any): string {
    if (imageLink) {
      return this.brickService.getImageUrl(imageLink);
    }
    return 'assets/fl-logo/logo.png';
  }
}
