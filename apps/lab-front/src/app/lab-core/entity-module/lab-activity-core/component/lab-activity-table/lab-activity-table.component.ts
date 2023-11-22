import {Component, Input} from '@angular/core';
import {
  ActivityObjectType,
  ActivityType,
  LabActivity,
  LabActivityDatasource
} from '../../../../model/entities/lab-activity.entity';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabEntityType} from '../../../../model/entities/lab-navigable-entity.entity';

@Component({
  selector: 'lab-activity-table',
  templateUrl: './lab-activity-table.component.html',
  styleUrls: ['./lab-activity-table.component.scss'],
})
export class LabActivityTableComponent {

  @Input() datasource: LabActivityDatasource;

  @Input() columns: FlTableColumnStatic<LabActivity>[];

  showLink(activity: LabActivity): boolean {
    return activity.activityType !== ActivityType.DELETE &&
      activity.objectId &&
      (activity.objectType === ActivityObjectType.EXPERIMENT ||
        activity.objectType === ActivityObjectType.REPORT);
  }

  getLabObjectType(activity: LabActivity): LabEntityType {
    switch (activity.objectType) {
      case ActivityObjectType.EXPERIMENT:
        return 'EXPERIMENT';
      case ActivityObjectType.REPORT:
        return 'REPORT';
      default:
        return null;
    }
  }

}
