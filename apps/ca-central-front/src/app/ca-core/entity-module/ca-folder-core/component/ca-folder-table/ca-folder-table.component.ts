import { Component, ContentChild, Input, TemplateRef, inject } from '@angular/core';
import {
  FlDialogService,
  FlMenuDynamicService,
  FlTableColumnStatic,
  FlViewContext,
} from '@monorepo/front-core-lib';
import { CaFolder, CaFolderDatasource } from '../../../../model/entities/folder/ca-folder.class';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaFolderActionEvent, CaFolderActionsMenu } from '../../model/ca-folder-actions-menu.class';
import { ClHelpService } from '@monorepo/core-lib';
import { CaSecurityService } from '../../../../service/ca-security.service';
import { CaFolderActionService } from '../../ca-folder-action.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { RouterLink } from '@angular/router';
import { CaFolderInlineComponent } from '../ca-folder-inline/ca-folder-inline.component';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
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
    MatSort,
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
  private dialogService = inject(FlDialogService);
  private menuDynamicService = inject(FlMenuDynamicService);
  private folderActionService = inject(CaFolderActionService);
  private securityService = inject(CaSecurityService);

  @Input({ required: true }) datasource: CaFolderDatasource<any>;

  @Input() columns: FlTableColumnStatic<CaFolder>[] = ['name', 'leader', 'creation', 'actions'];

  // to support custom column
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  openFolderActionMenu(folder: CaFolder, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const folderActionsMenu = new CaFolderActionsMenu(
      this.dialogService,
      this.folderActionService,
      this.menuDynamicService,
      this.securityService,
      {
        id: folder.id,
        name: folder.name,
        leader: folder.leader,
      }
    );

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
    } else if (folderEvent.action === 'delete') {
      this.datasource.removeItemById(folderEvent.folder.id);
    } else if (folderEvent.action === 'createChild') {
      this.routerService.navigateToFolderDetail(folderEvent.folder.id);
    }
  }
}
