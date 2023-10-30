import {AfterViewInit, Component, Host, Input, OnDestroy, OnInit} from '@angular/core';
import {FlEmbeddedOptionsAbstractDirective} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {CaCloudProviderService} from '../../../../service-api/ca-cloud-provider.service';
import {
  CaCloudProviderRegion,
  CaCloudProviderRegionDatasource
} from '../../../../model/entities/ca-cloud-provider.class';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'ca-select-cloud-provider-region-options',
  templateUrl: './ca-select-cloud-provider-region-options.component.html',
  styleUrls: ['./ca-select-cloud-provider-region-options.component.scss']
})
export class CaSelectCloudProviderRegionOptionsComponent extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy {

  @Input() mode: 'all' | 'all-s3' | 'current-space' | 'current-space-s3' = 'current-space';

  datasource: CaCloudProviderRegionDatasource;
  regions$: Observable<CaCloudProviderRegion[]>;


  constructor(private cloudProviderService: CaCloudProviderService,
              @Host() private select: MatSelect) {
    super(select);
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);

    switch (this.mode){
      case 'all':
        this.datasource = this.cloudProviderService.getAllRegionsDatasource();
        break;
      case 'all-s3':
        this.datasource = this.cloudProviderService.getAllS3RegionsDatasource();
        break;
      case 'current-space':
        this.datasource = this.cloudProviderService.getRegionsInCurrentSpaceDatasource();
        break;
      case 'current-space-s3':
        this.datasource = this.cloudProviderService.getS3RegionsInCurrentSpaceDatasource();
        break;
    }
    this.regions$ = this.datasource.connect();
  }


  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }

}
