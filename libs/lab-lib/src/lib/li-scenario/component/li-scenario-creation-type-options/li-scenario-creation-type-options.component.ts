import { AfterViewInit, Component, inject } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LI_SCENARIO_CREATION_TYPES } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-scenario-creation-type-options',
  templateUrl: './li-scenario-creation-type-options.component.html',
  styleUrls: ['./li-scenario-creation-type-options.component.scss'],
  imports: [MatOption, MatIcon, FlIconModule, FlCorePipeModule, TranslatePipe],
})
export class LiScenarioCreationTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  select: MatSelect;

  creationTypes = LI_SCENARIO_CREATION_TYPES;

  constructor() {
    const select = inject(MatSelect, { host: true, optional: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
