import { Component, Input } from '@angular/core';
import {
  LabSharedEntity,
  LabShareLink,
  LabShareLinkDatasource,
} from '../../../../model/entities/lab-share.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';

@Component({
    selector: 'lab-share-link-table',
    templateUrl: './lab-share-link-table.component.html',
    styleUrls: ['./lab-share-link-table.component.scss'],
    standalone: false
})
export class LabShareLinkTableComponent {
  @Input({ required: true }) datasource: LabShareLinkDatasource;

  @Input({ required: true }) columns: FlTableColumnStatic<LabSharedEntity>[];

  onLinkUpdated(entity: LabShareLink): void {
    this.datasource.updateItem(entity);
  }

  onLinkDeleted(entity: LabShareLink): void {
    this.datasource.removeItem(entity);
  }
}
