import { Component, Input, OnInit } from '@angular/core';
import { PrProtocolLink } from '@monorepo/protocol';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ca-scenario-technical-report-link',
  templateUrl: './ca-scenario-technical-report-link.component.html',
  styleUrls: ['./ca-scenario-technical-report-link.component.scss'],
  imports: [MatIcon],
})
export class CaScenarioTechnicalReportLinkComponent implements OnInit {
  @Input() link: PrProtocolLink;

  constructor() {}

  ngOnInit(): void {}
}
