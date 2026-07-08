import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ClHelpService } from '@monorepo/core-lib';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
CA_CLOUD_BUCKET_TYPES,
  CaBucketLocationDatasource,
  CaBucketLocationDTO,
  CaBucketType, } from '../../../../model/entities/ca-object-storage.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { CaCloudProviderRegionInlineComponent } from '../../../ca-cloud-provider-core/component/ca-cloud-provider-region-inline/ca-cloud-provider-region-inline.component';
import { CaBucketLocationInlineComponent } from '../ca-bucket-location-inline/ca-bucket-location-inline.component';

interface CaBucketLocationList {
  cloud: CaBucketLocationDTO[];
  lab: CaBucketLocationDTO[];
}

export type CaBucketLocationSelectMode = 'all' | 'cloud';

@Component({
  selector: 'ca-bucket-location-select-options',
  templateUrl: './ca-bucket-location-select-options.component.html',
  styleUrls: ['./ca-bucket-location-select-options.component.scss'],
  imports: [
    FlInfiniteScrollModule,
    MatOption,
    MatOptgroup,
    CaBucketLocationInlineComponent,
    CaCloudProviderRegionInlineComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaBucketLocationSelectOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private folderService = inject(CaFolderService);
  private select: MatSelect;

  @Input() mode: CaBucketLocationSelectMode = 'all';

  datasource: CaBucketLocationDatasource;
  locations$: Observable<CaBucketLocationList>;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.overrideCompareWith(this.select, (a: CaBucketLocationDTO, b: CaBucketLocationDTO) =>
      ClHelpService.compareFn(a, b, 'bucketId')
    );

    this.datasource = new CaBucketLocationDatasource(
      (page, size) => this.folderService.findAccessibleFolderBucketLocation(page, size),
      50
    );

    this.locations$ = this.datasource.connect().pipe(map((locations) => this.sortLocations(locations)));
  }

  private sortLocations(locations: CaBucketLocationDTO[]): CaBucketLocationList {
    return {
      cloud: locations
        .filter((location) => CA_CLOUD_BUCKET_TYPES.includes(location.bucketType))
        .sort((a, b) => a.locationName.localeCompare(b.locationName)),
      lab: locations
        .filter((location) => location.bucketType === CaBucketType.LAB)
        .sort((a, b) => a.locationName.localeCompare(b.locationName)),
    };
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }
}
