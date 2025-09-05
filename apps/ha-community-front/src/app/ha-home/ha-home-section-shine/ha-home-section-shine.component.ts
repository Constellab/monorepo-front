import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

@Component({
  selector: 'ha-home-section-shine',
  templateUrl: './ha-home-section-shine.component.html',
  styleUrls: ['./ha-home-section-shine.component.scss'],
  imports: [MatIconModule,FlIconModule],
})
export class HaHomeSectionShineComponent {}
