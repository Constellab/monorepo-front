import { Component, Input } from '@angular/core';
import {
  ActivityObjectType,
  ActivityType,
  LabActivity,
  LabActivityDatasource,
} from '../../../../model/entities/lab-activity.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabEntityType } from '../../../../model/entities/lab-navigable-entity.entity';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

@Component({
  selector: 'lab-activity-table',
  templateUrl: './lab-activity-table.component.html',
  styleUrls: ['./lab-activity-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlUserModule,
    MatSortHeader,
    FlDateModule,
    MatAnchor,
    RouterLink,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    LabDetailRoutePipe,
  ],
})
export class LabActivityTableComponent {
  @Input({ required: true }) datasource: LabActivityDatasource<any>;

  @Input() columns: FlTableColumnStatic<LabActivity>[] = [
    'user',
    'activityType',
    'objectType',
    'date',
    'objectId',
    'link',
  ];

  showLink(activity: LabActivity): boolean {
    return (
      activity.activityType !== ActivityType.DELETE &&
      activity.objectId &&
      (activity.objectType === ActivityObjectType.SCENARIO || activity.objectType === ActivityObjectType.NOTE)
    );
  }

  getLabObjectType(activity: LabActivity): LabEntityType {
    switch (activity.objectType) {
      case ActivityObjectType.SCENARIO:
        return 'SCENARIO';
      case ActivityObjectType.NOTE:
        return 'NOTE';
      default:
        return null;
    }
  }
}
