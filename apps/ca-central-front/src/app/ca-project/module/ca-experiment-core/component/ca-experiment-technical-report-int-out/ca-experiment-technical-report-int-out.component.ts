import {Component, Input, OnInit} from '@angular/core';
import {PrProtocolIntOut} from '@monorepo/protocol';

@Component({
  selector: 'ca-experiment-technical-report-int-out',
  templateUrl: './ca-experiment-technical-report-int-out.component.html',
  styleUrls: ['./ca-experiment-technical-report-int-out.component.scss']
})
export class CaExperimentTechnicalReportIntOutComponent implements OnInit {

  @Input() intOut: PrProtocolIntOut;

  @Input() isInterface: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
