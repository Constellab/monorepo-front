import { Component, Input } from '@angular/core';
import { LabNavigableEntity } from '../../../../model/entities/lab-navigable-entity.entity';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';

@Component({
  selector: 'lab-navigable-entity-inline',
  templateUrl: './lab-navigable-entity-inline.component.html',
  styleUrl: './lab-navigable-entity-inline.component.scss',
  imports: [FlTextIconModule, MatIcon, FlIconModule],
})
export class LabNavigableEntityInlineComponent {
  @Input() entity: LabNavigableEntity;
}
