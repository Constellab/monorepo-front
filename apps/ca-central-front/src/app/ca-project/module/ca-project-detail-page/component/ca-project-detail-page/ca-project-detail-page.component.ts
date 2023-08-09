import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {CaReport} from '../../../../../ca-core/model/entities/project/ca-report.class';
import {CaExperiment} from '../../../../../ca-core/model/entities/project/ca-experiment.class';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {map} from 'rxjs/operators';
import {FlArrayObs} from '@monorepo/front-core-lib';

/**
 * Page for a project detail
 */
@Component({
  selector: 'ca-project-detail-page',
  templateUrl: './ca-project-detail-page.component.html',
  styleUrls: ['./ca-project-detail-page.component.scss'],
  providers: [CaProjectDetailState]
})
export class CaProjectDetailPageComponent implements OnInit {

  projectId$: Observable<string>;

  experiments: FlArrayObs<CaExperiment>;
  reports: FlArrayObs<CaReport>;

  showChildren$: Observable<boolean>;
  showObjects$: Observable<boolean>;


  constructor(route: ActivatedRoute,
              private state: CaProjectDetailState) {
    this.state.init(route.params.pipe(
      map(params => params.projectId)
    ));
  }

  ngOnInit(): void {
    this.projectId$ = this.state.getProjectId$();
    this.experiments = this.state.getExperiments$();
    this.reports = this.state.getReports$();

    this.showChildren$ = this.state.getProject$(false).pipe(
      map(project => project?.hasChildren() ?? false),
    );

    this.showObjects$ = this.state.getProject$(false).pipe(
      map(project => project?.isLeaf() ?? false),
    );

  }

  selectReport(report: CaReport): void {
    this.state.updateRightPanelState({type: 'report', objectId: report.id});
  }

  selectExperiment(experiment: CaExperiment): void {
    this.state.updateRightPanelState({type: 'experiment', objectId: experiment.id});
  }

}
