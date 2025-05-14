import { Component, inject } from '@angular/core';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { Observable } from 'rxjs';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { AsyncPipe } from '@angular/common';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaNotificationMarkDirective } from '../../../../../ca-core/entity-module/ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';

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
    FlTagModule,
  ],
})
export class CaFolderDetailComponent {
  private state = inject(CaFolderDetailState);
  private eventState = inject(CaHierarchyObjectEventState);
  private hierarchyObjectDetailState = inject(CaHierarchyObjectDetailState);

  folder$: Observable<CaFolder> = this.state.getFolder$();
  canEdit$: Observable<boolean> = this.hierarchyObjectDetailState.canEditHierarchyObject$();
  tags = this.hierarchyObjectDetailState.getTags();

  private folderService = inject(CaFolderService);

  renameFolder(name: string, folder: CaFolder): void {
    this.folderService
      .renameFolder(folder.id, name)
      .subscribe((folder) => this.eventState.emitFolderUpdate(folder));
  }
}
