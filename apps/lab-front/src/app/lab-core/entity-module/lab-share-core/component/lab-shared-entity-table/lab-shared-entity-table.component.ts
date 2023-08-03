import {Component, Input} from '@angular/core';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabSharedEntity, LabSharedEntityDatasource} from '../../../../model/entities/lab-share.entity';

@Component({
  selector: 'lab-shared-entity-table',
  templateUrl: './lab-shared-entity-table.component.html',
  styleUrls: ['./lab-shared-entity-table.component.scss']
})
export class LabSharedEntityTableComponent {

  @Input() datasource: LabSharedEntityDatasource;

  @Input() columns: FlTableColumnStatic<LabSharedEntity>[] = ['lab', 'space', 'receiver', 'sharedBy'];

}
