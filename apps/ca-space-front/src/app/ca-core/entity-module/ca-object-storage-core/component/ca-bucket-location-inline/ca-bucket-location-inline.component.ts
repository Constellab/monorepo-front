import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

import { CaBucketLocationDTO } from '../../../../model/entities/ca-object-storage.class';
import { CaCloudProviderRegionInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';

@Component({
  selector: 'ca-bucket-location-inline',
  templateUrl: './ca-bucket-location-inline.component.html',
  styleUrls: ['./ca-bucket-location-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CaCloudProviderRegionInlineComponent, FlTextIconModule, MatIcon, FlIconModule],
})
export class CaBucketLocationInlineComponent {
  @Input({ required: true }) bucketLocation: CaBucketLocationDTO;
}
