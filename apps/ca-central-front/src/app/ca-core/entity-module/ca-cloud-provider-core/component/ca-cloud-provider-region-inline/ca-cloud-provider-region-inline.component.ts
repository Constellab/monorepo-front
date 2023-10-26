import {Component, Input} from '@angular/core';
import {CaCloudProviderRegion} from '../../../../model/entities/ca-cloud-provider.class';

@Component({
  selector: 'ca-bucket-region-inline',
  templateUrl: './ca-cloud-provider-region-inline.component.html',
  styleUrls: ['./ca-cloud-provider-region-inline.component.scss']
})
export class CaCloudProviderRegionInlineComponent {

  @Input() region: CaCloudProviderRegion;

}
