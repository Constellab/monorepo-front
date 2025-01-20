import { Component, Input } from '@angular/core';
import { CaCloudProviderRegion } from '../../../../model/entities/ca-cloud-provider.class';

@Component({
    selector: 'ca-cloud-provider-region-multilines',
    templateUrl: './ca-cloud-provider-region-multilines.component.html',
    styleUrl: './ca-cloud-provider-region-multilines.component.scss',
    standalone: false
})
export class CaCloudProviderRegionMultilinesComponent {
  @Input({ required: true }) region: CaCloudProviderRegion;
}
