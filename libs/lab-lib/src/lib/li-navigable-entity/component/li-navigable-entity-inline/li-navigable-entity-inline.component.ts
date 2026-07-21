import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiNavigableEntity } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-navigable-entity-inline',
  templateUrl: './li-navigable-entity-inline.component.html',
  styleUrl: './li-navigable-entity-inline.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlTextIconModule, MatIcon, FlIconModule],
})
export class LiNavigableEntityInlineComponent {
  @Input() entity: LiNavigableEntity;
}
