import { Component, Input } from '@angular/core';
import { CaHierarchyObject } from '../../../../model/entities/folder/ca-hierarchy-object.class';

@Component({
  selector: 'ca-hierarchy-object-inline',
  templateUrl: './ca-hierarchy-object-inline.component.html',
  styleUrl: './ca-hierarchy-object-inline.component.scss',
})
export class CaHierarchyObjectInlineComponent {
  @Input({ required: true }) hierarchyObject: CaHierarchyObject;
}
