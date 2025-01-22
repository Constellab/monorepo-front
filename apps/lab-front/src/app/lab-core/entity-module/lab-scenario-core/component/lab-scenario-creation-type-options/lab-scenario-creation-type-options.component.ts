import { AfterViewInit, Component, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { flScenarioCreationTypes } from '../../../../model/entities/lab-scenario.entity';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'lab-scenario-creation-type-options',
  templateUrl: './lab-scenario-creation-type-options.component.html',
  styleUrls: ['./lab-scenario-creation-type-options.component.scss'],
  standalone: false,
})
export class LabScenarioCreationTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  select: MatSelect;

  creationTypes = flScenarioCreationTypes;

  constructor() {
    const select = inject(MatSelect, { host: true, optional: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
