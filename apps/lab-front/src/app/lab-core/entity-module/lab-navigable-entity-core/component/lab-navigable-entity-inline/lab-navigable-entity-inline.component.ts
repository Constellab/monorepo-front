import { Component, Input } from '@angular/core';
import { LabNavigableEntity } from '../../../../model/entities/lab-navigable-entity.entity';

@Component({
    selector: 'lab-navigable-entity-inline',
    templateUrl: './lab-navigable-entity-inline.component.html',
    styleUrl: './lab-navigable-entity-inline.component.scss',
    standalone: false
})
export class LabNavigableEntityInlineComponent {
  @Input() entity: LabNavigableEntity;
}
