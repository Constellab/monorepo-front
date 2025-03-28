import { Component, Input } from '@angular/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiNavigableEntity } from '@monorepo/lab-lib/li-core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'li-navigable-entity-inline',
  templateUrl: './li-navigable-entity-inline.component.html',
  styleUrl: './li-navigable-entity-inline.component.scss',
  imports: [FlTextIconModule, MatIcon, FlIconModule],
})
export class LiNavigableEntityInlineComponent {
  @Input() entity: LiNavigableEntity;
}
