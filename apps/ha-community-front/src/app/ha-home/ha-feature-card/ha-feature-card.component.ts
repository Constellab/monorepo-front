import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

@Component({
  selector: 'ha-feature-card',
  templateUrl: './ha-feature-card.component.html',
  styleUrls: ['./ha-feature-card.component.scss'],
  standalone: true,
  imports: [MatIconModule, FlIconModule],
})
export class HaFeatureCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  iconName = input.required<string>();
}
