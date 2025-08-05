import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';

import { CaServerStandardDatasource } from '../../../../model/entities/server/ca-server-standard.class';
import { CaServerService } from '../../../../service-api/ca-server.service';

@Component({
  selector: 'ca-select-server-standard-options',
  templateUrl: './ca-select-server-standard-options.component.html',
  styleUrl: './ca-select-server-standard-options.component.scss',
  imports: [FlInfiniteScrollModule, FlCoreDirectiveModule, MatOption, AsyncPipe, FlCorePipeModule],
})
export class CaSelectServerStandardOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private serverService = inject(CaServerService);
  private select: MatSelect;

  datasource: CaServerStandardDatasource;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);
    this.datasource = this.serverService.findAllServerStandardDatasource();
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }
}
