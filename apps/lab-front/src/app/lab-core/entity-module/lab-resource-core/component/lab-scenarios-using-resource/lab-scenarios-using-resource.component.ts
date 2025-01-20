import { Component, Input, OnInit } from '@angular/core';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { LabScenario, LabScenarioDatasource } from '../../../../model/entities/lab-scenario.entity';

/**
 * Component to list in a Table the scenarios that use a resource
 */
@Component({
    selector: 'lab-scenarios-using-resource',
    templateUrl: './lab-scenarios-using-resource.component.html',
    styleUrls: ['./lab-scenarios-using-resource.component.scss'],
    standalone: false
})
export class LabScenariosUsingResourceComponent implements OnInit {
  @Input() resourceId: string;

  datasource: LabScenarioDatasource;

  columns: FlTableColumnStatic<LabScenario>[] = ['title', 'status'];

  constructor(private scenarioService: LabScenarioService) {}

  ngOnInit(): void {
    this.getDatasource();
  }

  public getDatasource(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.scenarioService.getByInputResource(this.resourceId, page, pageSize),
      5
    );
  }
}
