import {AfterViewInit, Component, Host, Optional} from '@angular/core';
import {FlEmbeddedOptionsAbstractDirective} from '@monorepo/front-core-lib';
import {LabExperimentCreationType} from '../../../../model/entities/lab-experiment.entity';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'lab-experiment-creation-type-options',
  templateUrl: './lab-experiment-creation-type-options.component.html',
  styleUrls: ['./lab-experiment-creation-type-options.component.scss']
})
export class LabExperimentCreationTypeOptionsComponent extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit {

  creationTypes: LabExperimentCreationType[] = ['MANUAL', 'AUTO'];

  constructor(@Host() @Optional() public select: MatSelect) {
    super(select);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
