import {Component, Input} from '@angular/core';
import {CaReport} from '../../../../../ca-core/model/entities/project/ca-report.class';
import {CaExperiment} from '../../../../../ca-core/model/entities/project/ca-experiment.class';
import {CaExperimentService} from '../../../../../ca-core/service-api/ca-experiment.service';
import {FlArrayObs, FlDialogService, FlEntityArrayObs} from '@monorepo/front-core-lib';
import {
  CaExperimentsListDialogInput,
  CaExperimentsTableDialogComponent
} from '../../../ca-experiment-core/component/ca-experiments-table-dialog/ca-experiments-table-dialog.component';

@Component({
  selector: 'ca-report-detail',
  templateUrl: './ca-report-detail.component.html',
  styleUrls: ['./ca-report-detail.component.scss'],
})
export class CaReportDetailComponent {

  @Input() report: CaReport;

  experiments: FlArrayObs<CaExperiment>;

  constructor(private experimentService: CaExperimentService,
              private dialogService: FlDialogService) {
  }

  printReport(): void {
    if (window) {
      window.print();
    }
  }

  openExperimentsListDialog(): void {
    this.experiments = new FlEntityArrayObs(this.experimentService.getExperimentsByReport(this.report.id));

    const input: CaExperimentsListDialogInput = {
      experiments: this.experiments,
      title: {text: 'report_associated_experiments', translateText: true}
    };

    this.dialogService.openMediumDialog(CaExperimentsTableDialogComponent, {data: input});
  }
}
