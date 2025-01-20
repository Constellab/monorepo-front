import { AfterViewInit, Component, Host, Input, OnDestroy, OnInit } from '@angular/core';
import {
  CaBucketLocationDatasource,
  CaBucketLocationDTO,
  CaBucketType,
} from '../../../../model/entities/ca-object-storage.class';
import { Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { ClHelpService } from '@monorepo/core-lib';
import { map } from 'rxjs/operators';

interface CaBucketLocationList {
  cloud: CaBucketLocationDTO[];
  lab: CaBucketLocationDTO[];
}

export type CaBucketLocationSelectMode = 'all' | 'cloud';

@Component({
    selector: 'ca-bucket-location-select-options',
    templateUrl: './ca-bucket-location-select-options.component.html',
    styleUrls: ['./ca-bucket-location-select-options.component.scss'],
    standalone: false
})
export class CaBucketLocationSelectOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mode: CaBucketLocationSelectMode = 'all';

  datasource: CaBucketLocationDatasource;
  locations$: Observable<CaBucketLocationList>;

  constructor(
    private folderService: CaFolderService,
    @Host() private select: MatSelect
  ) {
    super(select);
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
        .filter((location) => [CaBucketType.NORMAL, CaBucketType.AZURE].includes(location.bucketType))
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
