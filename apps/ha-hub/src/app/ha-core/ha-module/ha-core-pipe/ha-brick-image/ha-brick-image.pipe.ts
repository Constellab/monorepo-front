import { Pipe, PipeTransform, inject } from '@angular/core';
import { HaBrickService } from '../../../ha-service/ha-brick.service';

@Pipe({
  name: 'haBrickImage',
  standalone: false,
})
export class HaBrickImagePipe implements PipeTransform {
  private brickService = inject(HaBrickService);

  transform(imageLink: any): string {
    if (imageLink) {
      return this.brickService.getImageUrl(imageLink);
    }
    return 'assets/fl-logo/logo.png';
  }
}
