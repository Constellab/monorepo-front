import { AfterViewInit, Component, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { flScenarioCreationTypes } from '../../../../model/entities/lab-scenario.entity';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-creation-type-options',
  templateUrl: './lab-scenario-creation-type-options.component.html',
  styleUrls: ['./lab-scenario-creation-type-options.component.scss'],
  imports: [MatOption, MatIcon, FlIconModule, FlCorePipeModule, TranslatePipe],
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
