import { Component, Input } from '@angular/core';
import { CaCloudProviderRegion } from '../../../../model/entities/ca-cloud-provider.class';

@Component({
  selector: 'ca-cloud-provider-region-inline',
  templateUrl: './ca-cloud-provider-region-inline.component.html',
  styleUrls: ['./ca-cloud-provider-region-inline.component.scss'],
})
export class CaCloudProviderRegionInlineComponent {
  @Input({ required: true }) region: CaCloudProviderRegion;

  @Input() size: 'small' | 'medium' = 'medium';

  get imageSize(): number {
    return this.size === 'small' ? 20 : 25;
  }
}
