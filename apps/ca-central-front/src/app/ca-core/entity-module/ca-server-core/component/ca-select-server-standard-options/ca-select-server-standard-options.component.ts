import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { MatSelect } from '@angular/material/select';
import { CaServerStandardDatasource } from '../../../../model/entities/server/ca-server-standard.class';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatOption } from '@angular/material/core';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';

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
