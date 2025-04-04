import { Component, input } from '@angular/core';
import { LiResource } from '@monorepo/lab-lib/li-core';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'li-resource-inline',
  imports: [FlColorModule, FlIconModule, FlUserModule, MatIcon],
  templateUrl: './li-resource-inline.component.html',
  styleUrl: './li-resource-inline.component.scss',
})
export class LiResourceInlineComponent {
  resource = input.required<LiResource>();
}
