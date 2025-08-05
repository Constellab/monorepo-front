import { Component, Input } from '@angular/core';

import { CaFolder } from '../../../../model/entities/folder/ca-folder.class';
import { CaHierarchyObjectIconComponent } from '../../../ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';

@Component({
  selector: 'ca-folder-inline',
  templateUrl: './ca-folder-inline.component.html',
  styleUrls: ['./ca-folder-inline.component.scss'],
  imports: [CaHierarchyObjectIconComponent],
})
export class CaFolderInlineComponent {
  @Input({ required: true }) folder: CaFolder;
}
