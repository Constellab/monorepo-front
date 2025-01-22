import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { CaCloudProviderService } from '../../../../service-api/ca-cloud-provider.service';
import { CaCloudProviderRegionDatasource } from '../../../../model/entities/ca-cloud-provider.class';
import { MatSelect } from '@angular/material/select';

export type CaSelectCloudProviderRegionOptionsMode = 'all' | 'S3' | 'SERVER' | 'AZURE';

@Component({
  selector: 'ca-select-cloud-provider-region-options',
  templateUrl: './ca-select-cloud-provider-region-options.component.html',
  styleUrls: ['./ca-select-cloud-provider-region-options.component.scss'],
  standalone: false,
})
export class CaSelectCloudProviderRegionOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private cloudProviderService = inject(CaCloudProviderService);
  private select: MatSelect;

  @Input({ required: true }) set mode(mode: CaSelectCloudProviderRegionOptionsMode) {
    this.init(mode);
  }

  datasource: CaCloudProviderRegionDatasource;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);
  }

  private init(mode: CaSelectCloudProviderRegionOptionsMode): void {
    switch (mode) {
      case 'all':
        this.datasource = this.cloudProviderService.getAllRegionsDatasource();
        break;
      case 'S3':
        this.datasource = this.cloudProviderService.getRegionsByType('S3');
        break;
      case 'SERVER':
        this.datasource = this.cloudProviderService.getRegionsByType('SERVER');
        break;
      case 'AZURE':
        this.datasource = this.cloudProviderService.getRegionsByCloudProvider('AZURE');
        break;
    }
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }
}
