import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective, FlStatus } from '@monorepo/front-core-lib';
import { labScenarioStatusDict } from '../../../../model/entities/lab-scenario.entity';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-status-options',
  templateUrl: './lab-scenario-status-options.component.html',
  styleUrls: ['./lab-scenario-status-options.component.scss'],
  imports: [MatOption, TranslatePipe],
})
export class LabScenarioStatusOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  select: MatSelect;

  statusList: FlStatus[] = Object.values(labScenarioStatusDict);

  constructor() {
    const select = inject(MatSelect, { host: true, optional: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
