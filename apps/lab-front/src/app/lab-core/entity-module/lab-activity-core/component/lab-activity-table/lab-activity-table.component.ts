import { Component, Input } from '@angular/core';
import {
  ActivityObjectType,
  ActivityType,
  LabActivity,
  LabActivityDatasource,
} from '../../../../model/entities/lab-activity.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabEntityType } from '../../../../model/entities/lab-navigable-entity.entity';

@Component({
    selector: 'lab-activity-table',
    templateUrl: './lab-activity-table.component.html',
    styleUrls: ['./lab-activity-table.component.scss'],
    standalone: false
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
