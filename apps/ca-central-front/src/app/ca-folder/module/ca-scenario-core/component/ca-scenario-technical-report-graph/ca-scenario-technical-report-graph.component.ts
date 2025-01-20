import { Component, inject, Input } from '@angular/core';
import { PrProtocolGraph } from '@monorepo/protocol';
import { CoCommunityHelperService } from '@monorepo/community-lib';

@Component({
    selector: 'ca-scenario-technical-report-graph',
    templateUrl: './ca-scenario-technical-report-graph.component.html',
    styleUrls: ['./ca-scenario-technical-report-graph.component.scss'],
    standalone: false
})
export class CaScenarioTechnicalReportGraphComponent {
  @Input({ required: true }) graph: PrProtocolGraph;

  @Input() protocolName?: string;

  communityHelper = inject(CoCommunityHelperService);
}
