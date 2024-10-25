import { Component, inject } from '@angular/core';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { Observable } from 'rxjs';
import { CaHierarchyObjectType } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

/**
 * Show detailed information for a folder , used in FolderDetailPage
 */
@Component({
  selector: 'ca-folder-detail',
  templateUrl: './ca-folder-detail.component.html',
  styleUrls: ['./ca-folder-detail.component.scss']
})
export class CaFolderDetailComponent {

  private state = inject(CaFolderDetailState);

  folder$: Observable<CaFolder> = this.state.getFolder$();

  folderObjectType = CaHierarchyObjectType.FOLDER;
}
