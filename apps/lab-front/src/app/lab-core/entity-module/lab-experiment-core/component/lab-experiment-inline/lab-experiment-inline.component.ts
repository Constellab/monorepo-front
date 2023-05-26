import {Component, Input} from '@angular/core';
import {LabExperiment} from '../../../../model/entities/lab-experiment.entity';

@Component({
  selector: 'lab-experiment-inline',
  templateUrl: './lab-experiment-inline.component.html',
  styleUrls: ['./lab-experiment-inline.component.scss']
})
export class LabExperimentInlineComponent {

  @Input() experiment: LabExperiment;

}
