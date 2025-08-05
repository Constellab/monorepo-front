import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { Observable } from 'rxjs';

import {
  CaCloudProvider,
  CaCloudProviderDatasource,
} from '../../../../model/entities/ca-cloud-provider.class';
import { CaCloudProviderService } from '../../../../service-api/ca-cloud-provider.service';
import { CaCloudProviderInlineComponent } from '../ca-cloud-provider-inline/ca-cloud-provider-inline.component';

@Component({
  selector: 'ca-select-cloud-provider-options',
  templateUrl: './ca-select-cloud-provider-options.component.html',
  styleUrls: ['./ca-select-cloud-provider-options.component.scss'],
  imports: [
    FlInfiniteScrollModule,
    FlCoreDirectiveModule,
    MatOption,
    CaCloudProviderInlineComponent,
    AsyncPipe,
  ],
})
export class CaSelectCloudProviderOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private select: MatSelect;
  private cloudProviderService = inject(CaCloudProviderService);

  datasource: CaCloudProviderDatasource;
  cloudProviders$: Observable<CaCloudProvider[]>;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);
    this.datasource = this.cloudProviderService.findAllDatasource();
    this.cloudProviders$ = this.datasource.connect();
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }
}
