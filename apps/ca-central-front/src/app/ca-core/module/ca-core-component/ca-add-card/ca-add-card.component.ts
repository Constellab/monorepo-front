import { Component, Input, OnInit } from '@angular/core';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { MatRipple } from '@angular/material/core';

/**
 * Simple card use to add an object
 */
@Component({
  selector: 'ca-add-card',
  templateUrl: './ca-add-card.component.html',
  styleUrls: ['./ca-add-card.component.scss'],
  imports: [FlCardModule, MatRipple],
})
export class CaAddCardComponent implements OnInit {
  @Input() cardTitle: string;

  constructor() {}

  ngOnInit(): void {}
}
