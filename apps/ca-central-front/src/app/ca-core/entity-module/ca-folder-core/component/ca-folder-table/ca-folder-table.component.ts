import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { FlDialogService, FlMenuDynamicService, FlTableColumnStatic, FlViewContext } from '@monorepo/front-core-lib';
import { CaFolder, CaFolderDatasource } from '../../../../model/entities/folder/ca-folder.class';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaFolderActionEvent, CaFolderActionsMenu } from '../../model/ca-folder-actions-menu.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
  selector: 'ca-folder-table',
  templateUrl: './ca-folder-table.component.html',
  styleUrls: ['./ca-folder-table.component.scss']
})
export class CaFolderTableComponent {

  @Input({ required: true }) datasource: CaFolderDatasource;

  @Input() columns: FlTableColumnStatic<CaFolder>[] = ['code', 'leader', 'creation', 'actions'];

  // to support custom column
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;


  constructor(private routerService: CaRouterService,
              private dialogService: FlDialogService,
              private menuDynamicService: FlMenuDynamicService,
              private folderService: CaFolderService) {
  }

  openFolderActionMenu(folder: CaFolder, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const folderActionsMenu = new CaFolderActionsMenu(this.dialogService, this.folderService,
      this.menuDynamicService, {
        id: folder.id,
        title: folder.title,
        leader: folder.leader
      });

    folderActionsMenu.openActionMenu(event).subscribe(event => {
      this.onFolderAction(event);
    });
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

  getViewContent(folder: CaFolder): FlViewContext<CaFolder> {
    return { $implicit: folder };
  }

}
