import { Component, EventEmitter, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import {
  CaServerCloud,
  CaServerCloudDatasource,
} from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaSelectServerCloudDialogComponent } from '../ca-select-server-cloud-dialog/ca-select-server-cloud-dialog.component';

@Component({
    selector: 'ca-select-server-cloud',
    templateUrl: './ca-select-server-cloud.component.html',
    styleUrl: './ca-select-server-cloud.component.scss',
    providers: [{ provide: FlFormFieldDirective, useExisting: CaSelectServerCloudComponent }],
    standalone: false
})
export class CaSelectServerCloudComponent extends FlFormFieldDirective<CaServerCloud> implements OnInit {
  @Output() serverChange: EventEmitter<CaServerCloud> = new EventEmitter();

  selectedServer: CaServerCloud | Observable<CaServerCloud>;

  datasource: CaServerCloudDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<CaServerCloud>;

  constructor(
    @Optional() @Self() ngControl: NgControl,
    private serverService: CaServerService,
    private dialogService: FlDialogService
  ) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) =>
        this.serverService.searchServerCloudByName(data.filtersCriteria.searchText, page, pageSize),
      20,
      { initFirstPage: false }
    );

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(CaSelectServerCloudDialogComponent).afterClosed(),
    };
  }

  writeValue(obj: CaServerCloud): void {
    if (obj == null || obj.id == null) {
      this.selectedServer = null;
      this.value = null;
      return;
    }

    // if the provided object is not an instance of CaServerCloud, load it from the api
    if (!(obj instanceof CaServerCloud)) {
      this.selectedServer = this.serverService.findServerCloudById((obj as any).id);
    } else {
      this.selectedServer = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: CaServerCloud): void {
    this.serverChange.next(value);
    this.selectedServer = value;
  }

  onDisableChange(): void {}
}
