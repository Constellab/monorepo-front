import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaFolderActionService } from '../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import {
  CaFolderActionEvent,
  CaFolderActionsMenu,
} from '../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import { CaHierarchyObjectSearchFields } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import { CaHierarchyObjectTableComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import { CaFolderWithHierarchy } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaIsSpaceUserDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObjectSearchState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-search.state';
import { CaHierarchyObjectSearchFormComponent } from '../ca-hierarchy-object-search-form/ca-hierarchy-object-search-form.component';
import {
  CaHierarchyObjectTrashDialogComponent,
  CaHierarchyObjectTrashDialogInput,
} from '../ca-hierarchy-object-trash-dialog/ca-hierarchy-object-trash-dialog.component';

@Component({
  selector: 'ca-root-folder-page',
  imports: [
    CaHierarchyObjectTableComponent,
    FlCardModule,
    FlInfiniteScrollModule,
    FlTextIconModule,
    FlIconModule,
    TranslatePipe,
    MatButton,
    MatIcon,
    MatIconButton,
    CaHierarchyObjectSearchFormComponent,
    CaIsSpaceUserDirective,
    AsyncPipe,
  ],
  templateUrl: './ca-root-folders-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-root-folders-page.component.scss',
})
export class CaRootFoldersPageComponent implements OnInit {
  children: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = [
    'name',
    'user',
    'lastModifiedAt',
    'tags',
    'customAction',
  ];
  private state = inject(CaHierarchyObjectDetailState);
  private searchState = inject(CaHierarchyObjectSearchState);

  private folderActionService = inject(CaFolderActionService);
  private injector = inject(Injector);
  private dialogService = inject(FlDialogService);

  hierarchyObjectContext$ = inject(CaHierarchyObjectDetailState).getHierarchyContext$();

  ngOnInit(): void {
    this.children = this.searchState.childrenDatasource;
  }

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

  async hierarchyObjectMenuClick(hierarchyObject: CaHierarchyObject, event: MouseEvent): Promise<void> {
    ClHelpService.stopEventPropagation(event);

    const context = await this.state.getHierarchyContextPromise();
    const service = new CaFolderActionsMenu(this.injector, {
      id: hierarchyObject.id,
      name: hierarchyObject.name,
      userRole: context.userRole,
    });
    service
      .openTableItemActionMenu(event, true)
      .subscribe((hierarchyObjectActionEvent) =>
        this.onHierarchyObjectActionMenuEvent(hierarchyObjectActionEvent, hierarchyObject)
      );
  }

  private onHierarchyObjectActionMenuEvent(
    event: CaFolderActionEvent,
    hierarchyObject: CaHierarchyObject
  ): void {
    if (!event) return;

    if (event.action === 'update') {
      this.children.updatePartial(hierarchyObject.id, { name: event.folder.name }, CaHierarchyObject);
    } else if (event.action === 'moveToTrash') {
      this.children.removeItem(hierarchyObject);
    }
  }

  openTrash(): void {
    const data: CaHierarchyObjectTrashDialogInput = {
      mode: 'all',
    };

    this.dialogService.openMediumDialog(CaHierarchyObjectTrashDialogComponent, { data: data });
  }
}
