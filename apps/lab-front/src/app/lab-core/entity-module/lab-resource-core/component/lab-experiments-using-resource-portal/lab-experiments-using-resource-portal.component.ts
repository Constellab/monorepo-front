import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA, FlEntityPaginatedDatasource, FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabExperiment, LabExperimentDatasource} from '../../../../model/entities/lab-experiment.entity';
import {LabExperimentService} from '../../../../entity-service/lab-experiment.service';

@Component({
  selector: 'lab-experiments-using-resource-portal',
  templateUrl: './lab-experiments-using-resource-portal.component.html',
  styleUrl: './lab-experiments-using-resource-portal.component.scss'
})
export class LabExperimentsUsingResourcePortalComponent {

  datasource: LabExperimentDatasource;

  columns: FlTableColumnStatic<LabExperiment>[] = ['title', 'status'];

  constructor(@Inject(FL_PORTAL_DATA) resourceId: string,
              private experimentService: LabExperimentService) {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.experimentService.getByInputResource(resourceId,
        page, pageSize),
      5
    );
  }
}
