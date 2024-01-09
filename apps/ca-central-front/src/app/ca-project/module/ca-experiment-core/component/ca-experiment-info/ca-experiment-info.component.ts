import {Component, Input} from '@angular/core';
import {CaExperiment} from '../../../../../ca-core/model/entities/project/ca-experiment.class';
import {TeBasicConfig} from '@monorepo/text-editor';

@Component({
  selector: 'ca-experiment-info',
  templateUrl: './ca-experiment-info.component.html',
  styleUrls: ['./ca-experiment-info.component.scss']
})
export class CaExperimentInfoComponent {

  @Input() experiment: CaExperiment;

  textEditorConfig = new TeBasicConfig();

}
