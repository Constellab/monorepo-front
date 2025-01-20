import { Component, Input } from '@angular/core';
import { LabNavigableEntityGrouped } from '../../../../model/entities/lab-navigable-entity.entity';

@Component({
    selector: 'lab-navigable-entity-groups',
    templateUrl: './lab-navigable-entity-groups.component.html',
    styleUrls: ['./lab-navigable-entity-groups.component.scss'],
    standalone: false
})
export class LabNavigableEntityGroupsComponent {
  @Input() groups: LabNavigableEntityGrouped[];
}
