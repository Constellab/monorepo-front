import {AfterViewInit, Component, Host, OnDestroy, OnInit} from '@angular/core';
import {FlEmbeddedOptionsAbstractDirective} from '@monorepo/front-core-lib';
import {CaServerService} from '../../../../service-api/ca-server.service';
import {MatSelect} from '@angular/material/select';
import {CaServerStandardDatasource} from '../../../../model/entities/server/ca-server-standard.class';

@Component({
  selector: 'ca-select-server-standard-options',
  templateUrl: './ca-select-server-standard-options.component.html',
  styleUrl: './ca-select-server-standard-options.component.scss'
})
export class CaSelectServerStandardOptionsComponent extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy {

  datasource: CaServerStandardDatasource;


  constructor(private serverService: CaServerService,
              @Host() private select: MatSelect) {
    super(select);
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
