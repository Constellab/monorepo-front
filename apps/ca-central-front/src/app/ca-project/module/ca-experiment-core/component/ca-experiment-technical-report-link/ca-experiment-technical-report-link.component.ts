import {Component, Input, OnInit} from '@angular/core';
import {PrProtocolLink} from '@monorepo/protocol';

@Component({
  selector: 'ca-experiment-technical-report-link',
  templateUrl: './ca-experiment-technical-report-link.component.html',
  styleUrls: ['./ca-experiment-technical-report-link.component.scss']
})
export class CaExperimentTechnicalReportLinkComponent implements OnInit {

  @Input() link: PrProtocolLink;

  constructor() {
  }

  ngOnInit(): void {
  }

}
