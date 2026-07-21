import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiResource } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-resource-inline',
  imports: [FlColorModule, FlIconModule, FlUserModule, MatIcon],
  templateUrl: './li-resource-inline.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './li-resource-inline.component.scss',
})
export class LiResourceInlineComponent {
  resource = input.required<LiResource>();
}
