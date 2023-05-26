import {Component, Input, OnInit} from '@angular/core';
import {PrProtocolGraph} from '@monorepo/protocol';

@Component({
  selector: 'ca-experiment-technical-report-graph',
  templateUrl: './ca-experiment-technical-report-graph.component.html',
  styleUrls: ['./ca-experiment-technical-report-graph.component.scss']
})
export class CaExperimentTechnicalReportGraphComponent implements OnInit {

  @Input() graph: PrProtocolGraph;

  @Input() protocolName?: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
