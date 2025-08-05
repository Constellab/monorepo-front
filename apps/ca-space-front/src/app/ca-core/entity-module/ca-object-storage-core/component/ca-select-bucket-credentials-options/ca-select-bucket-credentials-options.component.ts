import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { Observable } from 'rxjs';

import {
  CaBucketCredentials,
  CaBucketCredentialsDatasource,
} from '../../../../model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../service-api/ca-object-storage.service';
import { CaBucketCredentialsInlineComponent } from '../ca-bucket-credentials-inline/ca-bucket-credentials-inline.component';

@Component({
  selector: 'ca-select-bucket-credentials-options',
  templateUrl: './ca-select-bucket-credentials-options.component.html',
  styleUrls: ['./ca-select-bucket-credentials-options.component.scss'],
  imports: [
    FlInfiniteScrollModule,
    FlCoreDirectiveModule,
    MatOption,
    CaBucketCredentialsInlineComponent,
    AsyncPipe,
  ],
})
export class CaSelectBucketCredentialsOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private objectStorageService = inject(CaObjectStorageService);
  private select: MatSelect;

  datasource: CaBucketCredentialsDatasource;
  credentials$: Observable<CaBucketCredentials[]>;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);
    this.datasource = this.objectStorageService.getAllCredentialsDatasource();
    this.credentials$ = this.datasource.connect();
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }
}
