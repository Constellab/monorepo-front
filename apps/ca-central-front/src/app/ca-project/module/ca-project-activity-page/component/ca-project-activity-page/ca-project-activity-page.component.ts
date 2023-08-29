import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {CaActivityDatasource} from '../../../../../ca-core/model/entities/ca-activity.class';
import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-project-activity-page',
  templateUrl: './ca-project-activity-page.component.html',
  styleUrls: ['./ca-project-activity-page.component.scss'],
})
export class CaProjectActivityPageComponent implements OnInit {

  datasource: CaActivityDatasource;

  constructor(private route: ActivatedRoute,
              private projectService: CaProjectService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.init(params.projectId);
    });
  }

  private init(projectId: string): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.projectService.searchActivity(projectId, page, size, filters),
      20, false);
  }
}
