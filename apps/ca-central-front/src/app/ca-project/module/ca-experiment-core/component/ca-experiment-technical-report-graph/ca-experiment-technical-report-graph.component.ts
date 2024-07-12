import { Component, inject, Input } from '@angular/core';
import { PrProtocolGraph } from '@monorepo/protocol';
import { CoCommunityHelperService } from '@monorepo/community-lib';

@Component({
  selector: 'ca-experiment-technical-report-graph',
  templateUrl: './ca-experiment-technical-report-graph.component.html',
  styleUrls: ['./ca-experiment-technical-report-graph.component.scss']
})
export class CaExperimentTechnicalReportGraphComponent {

  @Input({ required: true }) graph: PrProtocolGraph;

  @Input() protocolName?: string;

  communityHelper = inject(CoCommunityHelperService);
}
