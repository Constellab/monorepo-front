import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaExperiment } from '../../../../../ca-core/model/entities/folder/ca-experiment.class';

/**
 * Detail card of the experiment used in the experiment page
 */
@Component({
  selector: 'ca-experiment-card-detail',
  templateUrl: './ca-experiment-card-detail.component.html',
  styleUrls: ['./ca-experiment-card-detail.component.scss']
})
export class CaExperimentCardDetailComponent implements OnInit {

  @Input({required: true}) experiment: CaExperiment;

  @Input() showCardHeader: boolean = true;

  @Output() update: EventEmitter<CaExperiment> = new EventEmitter<CaExperiment>();

  experimentRoute: string;

  ngOnInit(): void {
    if (this.experiment.lab.isRunning()) {
      this.experimentRoute =
        `${this.experiment.lab.frontUrl}/app/biox/experiment/${this.experiment.id}`;
    }
  }
}
