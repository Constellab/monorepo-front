import { AfterViewInit, ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { FlStatus } from '@monorepo/front-core-lib/fl-status';
import { LI_SCENARIO_STATUS_DICT } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-scenario-status-options',
  templateUrl: './li-scenario-status-options.component.html',
  styleUrls: ['./li-scenario-status-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatOption, TranslatePipe],
})
export class LiScenarioStatusOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  select: MatSelect;

  statusList: FlStatus[] = Object.values(LI_SCENARIO_STATUS_DICT);

  constructor() {
    const select = inject(MatSelect, { host: true, optional: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
