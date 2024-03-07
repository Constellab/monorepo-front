import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA, FlEntityPaginatedDatasource, FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabExperiment, LabExperimentDatasource} from '../../../../../lab-core/model/entities/lab-experiment.entity';
import {LabExperimentService} from '../../../../../lab-core/entity-service/lab-experiment.service';
import {LabReport, LabReportDatasource} from '../../../../../lab-core/model/entities/lab-report.entity';
import {LabReportService} from '../../../../../lab-core/entity-service/lab-report.service';

@Component({
  selector: 'lab-resource-next-objects-portal',
  templateUrl: './lab-resource-next-objects-portal.component.html',
  styleUrl: './lab-resource-next-objects-portal.component.scss'
})
export class LabResourceNextObjectsPortalComponent {

  experiments: LabExperimentDatasource;
  experimentColumns: FlTableColumnStatic<LabExperiment>[] = ['title', 'status'];

  reports: LabReportDatasource;
  reportColumns: FlTableColumnStatic<LabReport>[] = ['title', 'lastModification'];

  constructor(@Inject(FL_PORTAL_DATA) resourceId: string,
              private experimentService: LabExperimentService,
              private reportService: LabReportService) {
    this.experiments = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.experimentService.getByInputResource(resourceId,
        page, pageSize),
      5
    );

    this.reports = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.reportService.getByResource(resourceId,
        page, pageSize),
      5
    );
  }
}
