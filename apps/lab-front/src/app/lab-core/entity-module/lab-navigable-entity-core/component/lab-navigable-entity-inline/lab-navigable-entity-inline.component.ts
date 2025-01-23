import { Component, Input } from '@angular/core';
import { LabNavigableEntity } from '../../../../model/entities/lab-navigable-entity.entity';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

@Component({
  selector: 'lab-navigable-entity-inline',
  templateUrl: './lab-navigable-entity-inline.component.html',
  styleUrl: './lab-navigable-entity-inline.component.scss',
  imports: [FlTextIconModule, MatIcon, FlIconModule],
})
export class LabNavigableEntityInlineComponent {
  @Input() entity: LabNavigableEntity;
}
