import { NgClass,NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CaCloudProvider } from '../../../../model/entities/ca-cloud-provider.class';

@Component({
  selector: 'ca-cloud-provider-inline',
  templateUrl: './ca-cloud-provider-inline.component.html',
  styleUrls: ['./ca-cloud-provider-inline.component.scss'],
  imports: [NgOptimizedImage, NgClass],
})
export class CaCloudProviderInlineComponent {
  @Input({ required: true }) cloudProvider: CaCloudProvider;

  @Input() size: 'medium' | 'small' = 'medium';

  get imgSize(): number {
    return this.size === 'medium' ? 30 : 15;
  }
}
