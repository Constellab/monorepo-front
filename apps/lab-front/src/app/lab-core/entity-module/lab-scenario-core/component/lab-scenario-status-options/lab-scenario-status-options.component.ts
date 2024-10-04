import { AfterViewInit, Component, Host, OnInit, Optional } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective, FlStatus } from '@monorepo/front-core-lib';
import { labScenarioStatusDict } from '../../../../model/entities/lab-scenario.entity';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'lab-scenario-status-options',
  templateUrl: './lab-scenario-status-options.component.html',
  styleUrls: ['./lab-scenario-status-options.component.scss']
})
export class LabScenarioStatusOptionsComponent extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit {

  statusList: FlStatus[] = Object.values(labScenarioStatusDict);

  constructor(@Host() @Optional() public select: MatSelect) {
    super(select);
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }


}
