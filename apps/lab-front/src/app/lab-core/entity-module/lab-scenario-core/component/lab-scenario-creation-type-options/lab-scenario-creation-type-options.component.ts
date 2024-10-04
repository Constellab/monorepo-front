import { AfterViewInit, Component, Host, Optional } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { flScenarioCreationTypes } from '../../../../model/entities/lab-scenario.entity';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'lab-scenario-creation-type-options',
  templateUrl: './lab-scenario-creation-type-options.component.html',
  styleUrls: ['./lab-scenario-creation-type-options.component.scss']
})
export class LabScenarioCreationTypeOptionsComponent extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit {

  creationTypes = flScenarioCreationTypes;

  constructor(@Host() @Optional() public select: MatSelect) {
    super(select);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
