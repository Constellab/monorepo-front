import { Component, Input } from '@angular/core';
import { CaBucketLocationDTO } from '../../../../model/entities/ca-object-storage.class';
import { CaCloudProviderRegionInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';

@Component({
  selector: 'ca-bucket-location-inline',
  templateUrl: './ca-bucket-location-inline.component.html',
  styleUrls: ['./ca-bucket-location-inline.component.scss'],
  imports: [CaCloudProviderRegionInlineComponent, FlTextIconModule, MatIcon, FlIconModule],
})
export class CaBucketLocationInlineComponent {
  @Input({ required: true }) bucketLocation: CaBucketLocationDTO;
}
