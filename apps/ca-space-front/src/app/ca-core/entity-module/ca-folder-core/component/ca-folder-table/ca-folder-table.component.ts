import { Component, ContentChild, inject, Injector, Input, TemplateRef } from '@angular/core';
import { FlTableColumnStatic, FlViewContext } from '@monorepo/front-core-lib/fl-core';

import { CaFolder, CaFolderDatasource } from '../../../../model/entities/folder/ca-folder.class';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaFolderActionEvent, CaFolderActionsMenu } from '../../model/ca-folder-actions-menu.class';
import { ClHelpService } from '@monorepo/core-lib';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { RouterLink } from '@angular/router';
import { CaFolderInlineComponent } from '../ca-folder-inline/ca-folder-inline.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-table',
  templateUrl: './ca-folder-table.component.html',
  styleUrls: ['./ca-folder-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    CaFolderInlineComponent,
    FlUserModule,
    MatIconButton,
    MatIcon,
    NgTemplateOutlet,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaFolderTableComponent {
  private routerService = inject(CaRouterService);
  private injector = inject(Injector);

  @Input({ required: true }) datasource: CaFolderDatasource<any>;

  @Input() columns: FlTableColumnStatic<CaFolder>[] = ['name', 'leader', 'creation', 'actions'];

  // to support custom column
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  openFolderActionMenu(folder: CaFolder, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const folderActionsMenu = new CaFolderActionsMenu(this.injector, {
      id: folder.id,
      name: folder.name,
      leader: folder.leader,
    });

    folderActionsMenu.openTableItemActionMenu(event).subscribe((event) => {
      this.onFolderAction(event);
    });
  }

  getViewContent(folder: CaFolder): FlViewContext<CaFolder> {
    return { $implicit: folder };
  }

  private onFolderAction(folderEvent: CaFolderActionEvent): void {
    if (folderEvent.action === 'update') {
      this.datasource.updateItem(folderEvent.folder);
    } else if (folderEvent.action === 'moveToTrash') {
      this.datasource.removeItemById(folderEvent.hierarchyObject.id);
    } else if (folderEvent.action === 'createChild') {
      this.routerService.navigateToFolderDetail(folderEvent.folder.id);
    } else if (folderEvent.action === 'moveToFolder') {
      this.routerService.navigateToFolderDetail(folderEvent.hierarchyObject.parentId);
    }
  }
}
