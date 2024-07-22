import { Component, Input } from '@angular/core';
import { FlDatasource, FlDialogService, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { HaBrickVersion } from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {
  HaPublicBrickVersionDetailDialogComponent
} from '../ha-public-brick-version-detail-dialog/ha-public-brick-version-detail-dialog.component';

@Component({
  selector: 'ha-public-brick-versions-table',
  templateUrl: './ha-public-brick-versions-table.component.html',
  styleUrls: ['./ha-public-brick-versions-table.component.scss']
})
export class HaPublicBrickVersionsTableComponent {

  @Input({ required: true }) datasource: FlDatasource<HaBrickVersion>;

  @Input() columns: FlTableColumnStatic<HaBrickVersion>[] = ['version', 'repoType', 'lastModified', 'informations'];

  constructor(private dialogService: FlDialogService) {
  }


  openBrickVersionDetail(bv: HaBrickVersion): void {
    this.dialogService.openMediumDialog(HaPublicBrickVersionDetailDialogComponent, { data: bv });
  }

}
