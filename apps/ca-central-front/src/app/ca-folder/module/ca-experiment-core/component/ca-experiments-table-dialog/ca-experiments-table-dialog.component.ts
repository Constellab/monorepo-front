import {Component, Inject} from '@angular/core';
import {FlArrayObs, FlTranslatableText} from '@monorepo/front-core-lib';
import {CaExperiment} from '../../../../../ca-core/model/entities/folder/ca-experiment.class';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface CaExperimentsListDialogInput {
  experiments: FlArrayObs<CaExperiment>;
  title: FlTranslatableText;
}

@Component({
  selector: 'ca-experiments-table-dialog',
  templateUrl: './ca-experiments-table-dialog.component.html',
  styleUrl: './ca-experiments-table-dialog.component.scss',
})
export class CaExperimentsTableDialogComponent {

  experiments: FlArrayObs<CaExperiment>;
  title: FlTranslatableText;

  constructor(@Inject(MAT_DIALOG_DATA) data: CaExperimentsListDialogInput) {
    this.experiments = data.experiments;
    this.title = data.title;
  }
}
