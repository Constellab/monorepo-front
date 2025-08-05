import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PrProtocolIntOut } from '@monorepo/protocol';

@Component({
  selector: 'ca-scenario-technical-report-int-out',
  templateUrl: './ca-scenario-technical-report-int-out.component.html',
  styleUrls: ['./ca-scenario-technical-report-int-out.component.scss'],
  imports: [MatIcon],
})
export class CaScenarioTechnicalReportIntOutComponent {
  @Input() intOut: PrProtocolIntOut;
}
