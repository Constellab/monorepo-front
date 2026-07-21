import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy,Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { Observable } from 'rxjs';

import {
  CaServerCloud,
  CaServerCloudDatasource,
} from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaServerCloudInlineComponent } from '../ca-server-cloud-inline/ca-server-cloud-inline.component';

@Component({
  selector: 'ca-select-server-cloud-options',
  templateUrl: './ca-select-server-cloud-options.component.html',
  styleUrls: ['./ca-select-server-cloud-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlInfiniteScrollModule,
    FlCoreDirectiveModule,
    MatOption,
    CaServerCloudInlineComponent,
    AsyncPipe,
  ],
})
export class CaSelectServerCloudOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private serverService = inject(CaServerService);
  private select: MatSelect;

  datasource: CaServerCloudDatasource;
  serverCloud$: Observable<CaServerCloud[]>;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);
    this.datasource = this.serverService.findAllServerCloudDatasource();
    this.serverCloud$ = this.datasource.connect();
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }
}
