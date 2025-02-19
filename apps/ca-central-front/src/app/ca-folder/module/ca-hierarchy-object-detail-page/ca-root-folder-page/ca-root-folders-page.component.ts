import { Component, inject } from '@angular/core';
import { CaHierarchyObjectBreadcrumbComponent } from '../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaHierarchyObjectTableComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CaFolderWithHierarchy } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaFolderActionService } from '../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';

@Component({
  selector: 'ca-root-folder-page',
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    CaHierarchyObjectTableComponent,
    FlCardModule,
    FlInfiniteScrollModule,
    FlTextIconModule,
    FlIconModule,
    TranslatePipe,
    MatButton,
    MatIcon,
  ],
  templateUrl: './ca-root-folders-page.component.html',
  styleUrl: './ca-root-folders-page.component.scss',
})
export class CaRootFoldersPageComponent {
  children: CaHierarchyObjectDatasource = inject(CaFolderService).getRootFoldersDatasource();

  columns: FlTableColumnStatic<CaHierarchyObject>[] = ['name', 'user', 'lastModifiedAt', 'tags'];

  private state = inject(CaHierarchyObjectDetailState);

  private folderActionService = inject(CaFolderActionService);

  openCreateFolderDialog(): void {
    this.folderActionService
      .openCreateRootFolderDialog()
      .subscribe((folders) => this.onCreateFolderClosed(folders));
  }

  private onCreateFolderClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.state.addFoldersInTree([folder.hierarchyRepresentation]);
      this.children.addItem(folder.hierarchyRepresentation, () => true);
    }
  }
}
