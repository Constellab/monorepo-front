import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PrProtocolLink } from '@monorepo/protocol';

@Component({
  selector: 'ca-scenario-technical-report-link',
  templateUrl: './ca-scenario-technical-report-link.component.html',
  styleUrls: ['./ca-scenario-technical-report-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon],
})
export class CaScenarioTechnicalReportLinkComponent {
  @Input() link: PrProtocolLink;
}
