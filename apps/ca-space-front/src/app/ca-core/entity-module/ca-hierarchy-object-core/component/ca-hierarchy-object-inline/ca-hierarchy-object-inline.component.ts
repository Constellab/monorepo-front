import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

import { CaHierarchyObject } from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectIconComponent } from '../ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';

@Component({
  selector: 'ca-hierarchy-object-inline',
  templateUrl: './ca-hierarchy-object-inline.component.html',
  styleUrl: './ca-hierarchy-object-inline.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CaHierarchyObjectIconComponent],
})
export class CaHierarchyObjectInlineComponent {
  @Input({ required: true }) hierarchyObject: CaHierarchyObject;
}
