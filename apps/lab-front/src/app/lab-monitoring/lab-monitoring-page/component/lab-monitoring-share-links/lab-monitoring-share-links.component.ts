import { Component } from '@angular/core';
import { LabShareLinkService } from '../../../../lab-core/entity-service/lab-share-link.service';
import { LabShareLink, LabShareLinkDatasource } from '../../../../lab-core/model/entities/lab-share.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';

@Component({
    selector: 'lab-monitoring-share-links',
    templateUrl: './lab-monitoring-share-links.component.html',
    styleUrls: ['./lab-monitoring-share-links.component.scss'],
    standalone: false
})
export class LabMonitoringShareLinksComponent {
  shareLinks: LabShareLinkDatasource = this.shareLinkService.getAllDatasource();

  columns: FlTableColumnStatic<LabShareLink>[] = [
    'entityType',
    'entityName',
    'validUntil',
    'downloadLink',
    'created',
    'actions',
  ];

  constructor(private shareLinkService: LabShareLinkService) {}
}
