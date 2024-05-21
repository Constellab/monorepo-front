import {AfterViewInit, Component, Host, Input, OnDestroy, OnInit} from '@angular/core';
import {FlEmbeddedOptionsAbstractDirective} from '@monorepo/front-core-lib';
import {CaCloudProviderService} from '../../../../service-api/ca-cloud-provider.service';
import {CaCloudProviderRegionDatasource} from '../../../../model/entities/ca-cloud-provider.class';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'ca-select-cloud-provider-region-options',
  templateUrl: './ca-select-cloud-provider-region-options.component.html',
  styleUrls: ['./ca-select-cloud-provider-region-options.component.scss']
})
export class CaSelectCloudProviderRegionOptionsComponent extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy {

  @Input({required: true}) mode: 'all' | 'S3' | 'SERVER';

  datasource: CaCloudProviderRegionDatasource;

  constructor(private cloudProviderService: CaCloudProviderService,
              @Host() private select: MatSelect) {
    super(select);
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);

    switch (this.mode) {
      case 'all':
        this.datasource = this.cloudProviderService.getAllRegionsDatasource();
        break;
      case 'S3':
        this.datasource = this.cloudProviderService.getRegionsByType('S3');
        break;
      case 'SERVER':
        this.datasource = this.cloudProviderService.getRegionsByType('SERVER');
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
