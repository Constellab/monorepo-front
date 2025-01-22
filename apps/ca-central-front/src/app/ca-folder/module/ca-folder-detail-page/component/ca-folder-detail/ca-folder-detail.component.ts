import { Component, inject } from '@angular/core';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { Observable } from 'rxjs';
import { CaHierarchyObjectType } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaNotificationMarkDirective } from '../../../../../ca-core/entity-module/ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { AsyncPipe } from '@angular/common';

/**
 * Show detailed information for a folder , used in FolderDetailPage
 */
@Component({
  selector: 'ca-folder-detail',
  templateUrl: './ca-folder-detail.component.html',
  styleUrls: ['./ca-folder-detail.component.scss'],
  imports: [
    CaHierarchyObjectIconComponent,
    CaNotificationMarkDirective,
    FlFormModule,
    FlUserModule,
    AsyncPipe,
  ],
})
export class CaFolderDetailComponent {
  private state = inject(CaFolderDetailState);

  folder$: Observable<CaFolder> = this.state.getFolder$();
  canEdit$: Observable<boolean> = this.state.canEditFolder$();

  folderObjectType = CaHierarchyObjectType.FOLDER;

  private folderService = inject(CaFolderService);

  renameFolder(name: string, folder: CaFolder): void {
    this.folderService.renameFolder(folder.id, name).subscribe((folder) => this.state.updateFolder(folder));
  }
}
