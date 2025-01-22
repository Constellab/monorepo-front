import { Component, Input } from '@angular/core';
import { CaCloudProviderRegion } from '../../../../model/entities/ca-cloud-provider.class';
import { NgOptimizedImage } from '@angular/common';
import { CaCountryFlagPipe } from '../../../ca-config-core/pipe/ca-country-flag/ca-country-flag.pipe';

@Component({
  selector: 'ca-cloud-provider-region-multilines',
  templateUrl: './ca-cloud-provider-region-multilines.component.html',
  styleUrl: './ca-cloud-provider-region-multilines.component.scss',
  imports: [NgOptimizedImage, CaCountryFlagPipe],
})
export class CaCloudProviderRegionMultilinesComponent {
  @Input({ required: true }) region: CaCloudProviderRegion;
}
