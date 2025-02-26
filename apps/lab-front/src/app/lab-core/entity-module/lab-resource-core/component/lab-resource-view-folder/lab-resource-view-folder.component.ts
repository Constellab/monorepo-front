import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  LabResourceViewFolder,
  LabResourceViewFolderContent,
  LabResourceViewFolderContentTree,
} from '../../../../model/entities/resource/lab-resource-view-folder.class';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';

import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { LabFileResourceService } from '../../../../entity-service/lab-file-resource.service';
import {
  LabFsNodeTypesSelectionDialogComponent,
  LabFsNodeTypesSelectionDialogInput,
  LabFsNodeTypesSelectionDialogResult,
} from '../lab-fs-node-types-selection-dialog/lab-fs-node-types-selection-dialog.component';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { LabRouterService } from '../../../../service/lab-router.service';
import { RvResourceViewDirective } from '@monorepo/resource-view';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDatasourceTree, FlTree } from '@monorepo/front-core-lib/fl-core';
import {
  FlDynamicFieldFormDialogComponent,
  FlDynamicFieldFormDialogInput,
  FlDynamicFieldFormDialogOutput,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { AsyncPipe } from '@angular/common';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Resource view for folder
 */
@Component({
  selector: 'lab-resource-view-folder',
  templateUrl: './lab-resource-view-folder.component.html',
  styleUrls: ['./lab-resource-view-folder.component.scss'],
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
export class LabResourceViewFolderComponent
  extends RvResourceViewDirective<LabResourceViewFolder>
  implements OnInit, OnDestroy
{
  private fileService = inject(LabFileResourceService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LabRouterService);
  private menuDynamicService = inject(FlMenuDynamicService);
  private resourceState = inject(LabResourceDetailState, { optional: true });
  private clipboardService = inject(FlClipboardService);
  private actionService = inject(FlPortalActionsService);
  private translateService = inject(FlTranslateService);

  datasource: FlDatasourceTree<LabResourceViewFolderContentTree>;

  ngOnInit(): void {
    this.datasource = new FlDatasourceTree();
    for (const child of this.view.data.content.children) {
      this.convertToTreeDataRecur(child, '');
    }
  }

  private convertToTreeDataRecur(
    data: LabResourceViewFolderContent,
    path: string,
    parentNodeId: string = null
  ): void {
    const isFolder = data.children != null;
    const node: LabResourceViewFolderContentTree = {
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
  extractNode(node: FlTree<LabResourceViewFolderContentTree>): void {
    const input: LabFsNodeTypesSelectionDialogInput = {
      dialogMode: node.object.isFolder ? 'folder' : 'files',
      filenames: [node.object.name],
      helpText: 'biox.extract_fs_node_help',
    };

    this.dialogService
      .openSmallDialog(LabFsNodeTypesSelectionDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.selectNodeTypeClosed(result, node));
  }

  private selectNodeTypeClosed(
    result: LabFsNodeTypesSelectionDialogResult,
    node: FlTree<LabResourceViewFolderContentTree>
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

  private extractFileSuccess(node: FlTree<LabResourceViewFolderContentTree>, resource: LabResource): void {
    node.object.isLoading = false;
    node.object.resource_model_id = resource.id;
    this.routerService.navigateToResourceDetail(resource.id);
  }

  // retrieve the node full path by calling ancestors, with '/' separator
  private getNodePath(node: FlTree<LabResourceViewFolderContentTree>): string {
    let path: string = null;
    let currentNode: FlTree<LabResourceViewFolderContentTree> = node;
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
  openMenu(node: FlTree<LabResourceViewFolderContentTree>, event: MouseEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    const menuDynamic: FlMenuDynamic[] = [];

    //TODO : this only work when the view is under resource state
    if (!node.object.isFolder && this.resourceState) {
      // button to extract the node
      menuDynamic.push({
        type: 'button',
        text: 'biox.folder_view_sub_files',
        onClick: () => this.callFileView(node),
        icon: 'visibility',
      });
    }

    if (node.object.resource_model_id) {
      menuDynamic.push({
        type: 'link',
        text: 'resource',
        link: LabRouterService.getResourceDetailRoute(node.object.resource_model_id),
        icon: 'resource',
      });
    } else {
      // button to extract the node
      menuDynamic.push({
        type: 'button',
        text: node.object.isFolder ? 'biox.folder_extract_folder' : 'biox.folder_extract_file',
        onClick: () => this.extractNode(node),
        icon: 'drive_file_move',
      });
    }

    // button to download
    menuDynamic.push({
      type: 'button',
      text: 'biox.download_folder_sub_node',
      onClick: () => this.downloadFolderSubFile(node),
      icon: 'cloud_download',
    });

    // button to copy the node path
    menuDynamic.push({
      type: 'button',
      text: 'biox.folder_copy_node_path',
      onClick: () => this.clipboardService.copy(this.getNodePath(node), 'biox.folder_node_path_copied'),
      icon: 'content_copy',
    });

    // button to rename the node
    menuDynamic.push({
      type: 'button',
      text: node.object.isFolder ? 'biox.rename_folder' : 'biox.rename_file',
      onClick: () => this.updateSubNodeName(node),
      icon: 'edit',
    });

    // button to delete the node
    menuDynamic.push({
      type: 'button',
      text: node.object.isFolder ? 'biox.delete_folder' : 'biox.delete_file',
      onClick: () => this.deleteSubNode(node),
      icon: 'delete',
      color: 'warn',
    });

    this.menuDynamicService.openDynamicMenuAbsolute(menuDynamic, event);
  }

  // open the dialog to select the node type
  private callFileView(node: FlTree<LabResourceViewFolderContentTree>): void {
    this.resourceState.callView(
      this.fileService.callFolderSubFileView(this.resourceId, this.getNodePath(node)),
      node.object.name
    );
  }

  private downloadFolderSubFile(node: FlTree<LabResourceViewFolderContentTree>): void {
    const action: FlPortalAction = {
      type: 'download-folder-sub-node',
      action: this.fileService.downloadFolderSubFile(this.resourceId, this.getNodePath(node)),
      text: { text: 'biox.folder_sub_node_downloading', translateText: true },
    };

    this.actionService.addAction(action);
  }

  private deleteSubNode(node: FlTree<LabResourceViewFolderContentTree>): void {
    const confirm: FlConfirmDialogInput = {
      title: node.object.isFolder ? 'biox.delete_folder' : 'biox.delete_file',
      content: 'biox.delete_node_confirmation',
      observable: this.fileService.deleteFolderSubNode(this.resourceId, this.getNodePath(node)),
      successMessage: 'biox.node_deleted',
    };

    this.dialogService
      .openConfirmDialog(confirm)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, node));
  }

  private onDeleteClosed(
    result: FlConfirmDialogResult,
    node: FlTree<LabResourceViewFolderContentTree>
  ): void {
    if (result.choice) {
      this.datasource.deleteNode(node.id);
    }
  }

  private updateSubNodeName(node: FlTree<LabResourceViewFolderContentTree>): void {
    const data: FlDynamicFieldFormDialogInput = {
      title: node.object.isFolder ? 'biox.rename_folder' : 'biox.rename_file',
      helpText: 'biox.rename_node_help',
      data: node.object.name,
      config: {
        controlType: 'formControl',
        type: 'input',
        inputType: 'text',
        placeholder: this.translateService.translate('name'),
      },
      submit: (data) => this.fileService.renameFolderSubNode(this.resourceId, this.getNodePath(node), data),
      successMessage: 'biox.node_renamed',
    };

    this.dialogService
      .openSmallDialog(FlDynamicFieldFormDialogComponent, { data: data })
      .afterClosed()
      .subscribe((result) => this.onNodeRenamed(node, result));
  }

  private onNodeRenamed(
    node: FlTree<LabResourceViewFolderContentTree>,
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
