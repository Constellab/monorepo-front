import { Component, Input } from '@angular/core';
import {
  ActivityObjectType,
  ActivityType,
  LabActivity,
  LabActivityDatasource,
} from '../../../../model/entities/lab-activity.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LabEntityType } from '../../../../model/entities/lab-navigable-entity.entity';
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
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
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
