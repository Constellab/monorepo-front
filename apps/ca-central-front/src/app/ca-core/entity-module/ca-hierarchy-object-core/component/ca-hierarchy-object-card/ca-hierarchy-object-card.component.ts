import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaHierarchyObject } from '../../../../model/entities/folder/ca-hierarchy-object.class';

@Component({
    selector: 'ca-hierarchy-object-card',
    templateUrl: './ca-hierarchy-object-card.component.html',
    styleUrl: './ca-hierarchy-object-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaHierarchyObjectCardComponent {
  @Input({ required: true }) hierarchyObject: CaHierarchyObject;
}
