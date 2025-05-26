import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { FlDatasourceTree, FlTree } from '@monorepo/front-core-lib/fl-core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  FlDynamicFieldFormDialogComponent,
  FlDynamicFieldFormDialogInput,
  FlDynamicFieldFormDialogOutput,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import {
  LiFileResourceService,
  LiResource,
  LiResourceViewFolder,
  LiResourceViewFolderContent,
  LiResourceViewFolderContentTree,
  LiRouterService,
} from '@monorepo/lab-lib/li-core';
import { RvResourceViewDirective } from '@monorepo/resource-view';
import { TranslatePipe } from '@ngx-translate/core';
import { LiResourceDetailState } from '../../state/li-resource-detail.state';
import {
  LiFsNodeTypesSelectionDialogComponent,
  LiFsNodeTypesSelectionDialogInput,
  LiFsNodeTypesSelectionDialogResult,
} from '../li-fs-node-types-selection-dialog/li-fs-node-types-selection-dialog.component';

/**
 * Resource view for folder
 */
@Component({
  selector: 'li-resource-view-folder',
  templateUrl: './li-resource-view-folder.component.html',
  styleUrls: ['./li-resource-view-folder.component.scss'],
  imports: [
    MatTree,
    MatTreeNodeDef,
    MatTreeNode,
    MatTreeNodePadding,
    FlLoaderModule,
    MatIconButton,
    MatIcon,
    MatTreeNodeToggle,
    AsyncPipe,
    FlCoreComponentModule,
    TranslatePipe,
  ],
})
export class LiResourceViewFolderComponent
  extends RvResourceViewDirective<LiResourceViewFolder>
  implements OnInit, OnDestroy
{
  private fileService = inject(LiFileResourceService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LiRouterService);
  private menuDynamicService = inject(FlMenuDynamicService);
  private resourceState = inject(LiResourceDetailState, { optional: true });
  private clipboardService = inject(FlClipboardService);
  private actionService = inject(FlPortalActionsService);
  private translateService = inject(FlTranslateService);

  datasource: FlDatasourceTree<LiResourceViewFolderContentTree>;

  ngOnInit(): void {
    this.datasource = new FlDatasourceTree();
    for (const child of this.view.data.content.children) {
      this.convertToTreeDataRecur(child, '');
    }
  }

  private convertToTreeDataRecur(
    data: LiResourceViewFolderContent,
    path: string,
    parentNodeId: string = null
  ): void {
    const isFolder = data.children != null;
    const node: LiResourceViewFolderContentTree = {
      id: path + '/' + data.name,
      name: data.name,
      resource_model_id: data.resource_model_id,
      isFolder: isFolder,
      isLoading: false,
    };
    this.datasource.addOrReplaceNode(node, parentNodeId);

    if (isFolder) {
      for (const child of data.children) {
        this.convertToTreeDataRecur(child, node.id, node.id);
      }
    }
  }

  // open the dialog to select the node type
  extractNode(node: FlTree<LiResourceViewFolderContentTree>): void {
    const input: LiFsNodeTypesSelectionDialogInput = {
      dialogMode: node.object.isFolder ? 'folder' : 'files',
      filenames: [node.object.name],
      helpText: 'li.extract_fs_node_help',
    };

    this.dialogService
      .openSmallDialog(LiFsNodeTypesSelectionDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.selectNodeTypeClosed(result, node));
  }

  private selectNodeTypeClosed(
    result: LiFsNodeTypesSelectionDialogResult,
    node: FlTree<LiResourceViewFolderContentTree>
  ): void {
    if (result == null) return;

    const path: string = this.getNodePath(node);
    const typingName = result.uploadMode === 'files' ? result.fileTypingNames[0] : result.folderTypingName;

    node.object.isLoading = true;
    this.fileService.extractNode(this.resourceId, path, typingName).subscribe({
      next: (resource) => this.extractFileSuccess(node, resource),
      error: () => (node.object.isLoading = false),
    });
  }

  private extractFileSuccess(node: FlTree<LiResourceViewFolderContentTree>, resource: LiResource): void {
    node.object.isLoading = false;
    node.object.resource_model_id = resource.id;
    this.routerService.navigateToResourceDetail(resource.id);
  }

  // retrieve the node full path by calling ancestors, with '/' separator
  private getNodePath(node: FlTree<LiResourceViewFolderContentTree>): string {
    let path: string = null;
    let currentNode: FlTree<LiResourceViewFolderContentTree> = node;
    while (currentNode) {
      if (currentNode.object.name) {
        if (path == null) {
          path = currentNode.object.name;
        } else {
          path = currentNode.object.name + '/' + path;
        }
      }
      currentNode = currentNode.parent;
    }
    return path;
  }

  // use to open menu on right click
  openMenu(node: FlTree<LiResourceViewFolderContentTree>, event: MouseEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    const menuDynamic: FlMenuDynamic[] = [];

    //TODO : this only work when the view is under resource state
    if (!node.object.isFolder && this.resourceState) {
      // button to extract the node
      menuDynamic.push({
        type: 'button',
        text: 'li.folder_view_sub_files',
        onClick: () => this.callFileView(node),
        icon: 'visibility',
      });
    }

    if (node.object.resource_model_id) {
      menuDynamic.push({
        type: 'link',
        text: 'li.resource',
        link: LiRouterService.getResourceDetailRoute(node.object.resource_model_id),
        icon: 'resource',
      });
    } else {
      // button to extract the node
      menuDynamic.push({
        type: 'button',
        text: node.object.isFolder ? 'li.folder_extract_folder' : 'li.folder_extract_file',
        onClick: () => this.extractNode(node),
        icon: 'drive_file_move',
      });
    }

    // button to download
    menuDynamic.push({
      type: 'button',
      text: 'li.download_folder_sub_node',
      onClick: () => this.downloadFolderSubFile(node),
      icon: 'cloud_download',
    });

    // button to copy the node path
    menuDynamic.push({
      type: 'button',
      text: 'li.folder_copy_node_path',
      onClick: () => this.clipboardService.copy(this.getNodePath(node), 'li.folder_node_path_copied'),
      icon: 'content_copy',
    });

    // button to rename the node
    menuDynamic.push({
      type: 'button',
      text: node.object.isFolder ? 'li.rename_folder' : 'li.rename_file',
      onClick: () => this.updateSubNodeName(node),
      icon: 'edit',
    });

    // button to delete the node
    menuDynamic.push({
      type: 'button',
      text: node.object.isFolder ? 'li.delete_folder' : 'li.delete_file',
      onClick: () => this.deleteSubNode(node),
      icon: 'delete',
      color: 'warn',
    });

    this.menuDynamicService.openDynamicMenuAbsolute(menuDynamic, event);
  }

  // open the dialog to select the node type
  private callFileView(node: FlTree<LiResourceViewFolderContentTree>): void {
    this.resourceState.callView(
      this.fileService.callFolderSubFileView(this.resourceId, this.getNodePath(node)),
      node.object.name
    );
  }

  private downloadFolderSubFile(node: FlTree<LiResourceViewFolderContentTree>): void {
    const action: FlPortalAction = {
      type: 'download-folder-sub-node',
      action: this.fileService.downloadFolderSubFile(this.resourceId, this.getNodePath(node)),
      text: { text: 'li.folder_sub_node_downloading', translateText: true },
    };

    this.actionService.addAction(action);
  }

  private deleteSubNode(node: FlTree<LiResourceViewFolderContentTree>): void {
    const confirm: FlConfirmDialogInput = {
      title: node.object.isFolder ? 'li.delete_folder' : 'li.delete_file',
      content: 'li.delete_node_confirmation',
      observable: this.fileService.deleteFolderSubNode(this.resourceId, this.getNodePath(node)),
      successMessage: 'li.node_deleted',
    };

    this.dialogService
      .openConfirmDialog(confirm)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, node));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, node: FlTree<LiResourceViewFolderContentTree>): void {
    if (result.choice) {
      this.datasource.deleteNode(node.id);
    }
  }

  private updateSubNodeName(node: FlTree<LiResourceViewFolderContentTree>): void {
    const data: FlDynamicFieldFormDialogInput = {
      title: node.object.isFolder ? 'li.rename_folder' : 'li.rename_file',
      helpText: 'li.rename_node_help',
      data: node.object.name,
      config: {
        controlType: 'formControl',
        type: 'input',
        inputType: 'text',
        placeholder: this.translateService.translate('name'),
      },
      submit: (data) => this.fileService.renameFolderSubNode(this.resourceId, this.getNodePath(node), data),
      successMessage: 'li.node_renamed',
    };

    this.dialogService
      .openSmallDialog(FlDynamicFieldFormDialogComponent, { data: data })
      .afterClosed()
      .subscribe((result) => this.onNodeRenamed(node, result));
  }

  private onNodeRenamed(
    node: FlTree<LiResourceViewFolderContentTree>,
    result?: FlDynamicFieldFormDialogOutput
  ): void {
    if (result) {
      node.object.name = result.formValue;
      this.datasource.updateNodeInfo(node.object);
    }
  }

  ngOnDestroy(): void {
    this.datasource?.disconnect();
  }
}
