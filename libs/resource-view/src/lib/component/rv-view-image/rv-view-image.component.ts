import { ChangeDetectionStrategy,Component } from '@angular/core';

import { RvResourceViewImage } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

@Component({
  selector: 'rv-view-image',
  templateUrl: './rv-view-image.component.html',
  styleUrls: ['./rv-view-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RvViewImageComponent extends RvResourceViewDirective<RvResourceViewImage> {
  constructor() {
    super();
  }
}
