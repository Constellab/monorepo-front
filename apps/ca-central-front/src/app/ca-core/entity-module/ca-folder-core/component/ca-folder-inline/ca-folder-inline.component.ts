import { Component, Input } from '@angular/core';
import { CaFolder } from '../../../../model/entities/folder/ca-folder.class';
import { CaHierarchyObjectType } from '../../../../model/entities/folder/ca-hierarchy-object.class';

@Component({
  selector: 'ca-folder-inline',
  templateUrl: './ca-folder-inline.component.html',
  styleUrls: ['./ca-folder-inline.component.scss']
})
export class CaFolderInlineComponent {

  @Input({ required: true }) folder: CaFolder;

  folderObjectType = CaHierarchyObjectType.FOLDER;

}
