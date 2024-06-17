import {Component, Input} from '@angular/core';
import {CoSpace} from '../../model/co-space.class';
import {CoConfig} from '../../service/co-service-config.config';
import {ClStringHelper} from '@monorepo/core-lib';


@Component({
  selector: 'co-visibility-badge',
  templateUrl: './co-visibility-badge.component.html',
  styleUrls: ['./co-visibility-badge.component.scss']
})
export class CoVisibilityBadgeComponent {

  @Input() space: CoSpace = null;

  constructor(private coServiceConfig: CoConfig) {
  }

  get spacePhoto(): string {
    if (this.space && this.space.photo && !ClStringHelper.isHttpLink(this.space.photo)) {
      this.space.photo = this.coServiceConfig.getSpacePhotoUrl(this.space.photo);
    }
    return this.space.photo;
  }

}
