import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import {
  CaServerCloud,
  CaServerCloudDatasource,
} from '../../../../model/entities/server/ca-server-cloud.class';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { CaSelectServerCloudDialogComponent } from '../ca-select-server-cloud-dialog/ca-select-server-cloud-dialog.component';
import { NgOptimizedImage } from '@angular/common';
import { CaServerCloudInlineComponent } from '../ca-server-cloud-inline/ca-server-cloud-inline.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-select-server-cloud',
  templateUrl: './ca-select-server-cloud.component.html',
  styleUrl: './ca-select-server-cloud.component.scss',
  providers: [{ provide: FlFormFieldDirective, useExisting: CaSelectServerCloudComponent }],
  imports: [FlInputSearchModule, NgOptimizedImage, CaServerCloudInlineComponent, TranslatePipe],
})
export class CaSelectServerCloudComponent extends FlFormFieldDirective<CaServerCloud> implements OnInit {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);

  @Output() serverChange: EventEmitter<CaServerCloud> = new EventEmitter();

  selectedServer: CaServerCloud | Observable<CaServerCloud>;

  datasource: CaServerCloudDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<CaServerCloud>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

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
