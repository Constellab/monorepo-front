import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CaServerService } from '../../../../service-api/ca-server.service';
import {
  CaServerCloud,
  CaServerCloudDatasource,
} from '../../../../model/entities/server/ca-server-cloud.class';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatOption } from '@angular/material/core';
import { CaServerCloudInlineComponent } from '../ca-server-cloud-inline/ca-server-cloud-inline.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ca-select-server-cloud-options',
  templateUrl: './ca-select-server-cloud-options.component.html',
  styleUrls: ['./ca-select-server-cloud-options.component.scss'],
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
