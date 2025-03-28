import {
  ActivityObjectType,
  ActivityType,
  LiActivity,
  LiActivityDatasource,
  LiDetailRoutePipe,
  LiEntityType,
} from '@monorepo/lab-lib/li-core';
import { Component, Input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatAnchor } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-activity-table',
  templateUrl: './li-activity-table.component.html',
  styleUrls: ['./li-activity-table.component.scss'],
  imports: [
    MatTable,
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
    LiDetailRoutePipe,
  ],
})
export class LiActivityTableComponent {
  @Input({ required: true }) datasource: LiActivityDatasource<any>;

  @Input() columns: FlTableColumnStatic<LiActivity>[] = [
    'user',
    'activityType',
    'objectType',
    'date',
    'objectId',
    'link',
  ];

  showLink(activity: LiActivity): boolean {
    return (
      activity.activityType !== ActivityType.DELETE &&
      activity.objectId &&
      (activity.objectType === ActivityObjectType.SCENARIO || activity.objectType === ActivityObjectType.NOTE)
    );
  }

  getLabObjectType(activity: LiActivity): LiEntityType {
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
