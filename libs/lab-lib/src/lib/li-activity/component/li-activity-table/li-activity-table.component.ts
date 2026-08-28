import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
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
import { RouterLink } from '@angular/router';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  ActivityObjectType,
  ActivityType,
  LiActivity,
  LiActivityDatasource,
  LiDetailRoutePipe,
  LiEntityType,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-activity-table',
  templateUrl: './li-activity-table.component.html',
  styleUrls: ['./li-activity-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
      !!activity.objectId &&
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
        // only called from the template when showLink(activity) is true, i.e. for SCENARIO or NOTE
        throw new Error(`[LiActivityTableComponent] unsupported object type ${activity.objectType}`);
    }
  }
}
