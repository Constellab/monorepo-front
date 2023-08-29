import {Component, Input} from '@angular/core';
import {CaActivity, CaActivityDatasource} from '../../../../model/entities/ca-activity.class';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-activity-table',
  templateUrl: './ca-activity-table.component.html',
  styleUrls: ['./ca-activity-table.component.scss'],
})
export class CaActivityTableComponent {

  @Input() datasource: CaActivityDatasource;

  @Input() columns: FlTableColumnStatic<CaActivity>[];
}
