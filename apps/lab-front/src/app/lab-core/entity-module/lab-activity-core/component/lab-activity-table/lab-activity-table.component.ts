import {Component, Input} from '@angular/core';
import {
  ActivityObjectType,
  ActivityType,
  LabActivity,
  LabActivityDatasource
} from '../../../../model/entities/lab-activity.entity';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabObjectType} from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

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

  getLabObjectType(activity: LabActivity): LabObjectType {
    switch (activity.objectType) {
      case ActivityObjectType.EXPERIMENT:
        return 'experiment';
      case ActivityObjectType.REPORT:
        return 'report';
      default:
        return null;
    }
  }

}
