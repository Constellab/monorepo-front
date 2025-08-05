import { Component, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';

/**
 * Simple card use to add an object
 */
@Component({
  selector: 'ca-add-card',
  templateUrl: './ca-add-card.component.html',
  styleUrls: ['./ca-add-card.component.scss'],
  imports: [FlCardModule, MatRipple],
})
export class CaAddCardComponent {
  @Input() cardTitle: string;
}
