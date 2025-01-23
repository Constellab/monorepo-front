import { Component, inject, OnInit } from '@angular/core';
import {
  LabResourceViewFolder,
  LabResourceViewFolderContent,
  LabResourceViewFolderContentFlat,
} from '../../../../model/entities/resource/lab-resource-view-folder.class';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFlatTreeControl } from '@monorepo/front-core-lib/fl-core';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';

import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
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
  ],
})
export class LabResourceViewFolderComponent
  extends RvResourceViewDirective<LabResourceViewFolder>
  implements OnInit
{
  private fileService = inject(LabFileResourceService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LabRouterService);
  private menuDynamicService = inject(FlMenuDynamicService);
  private resourceState = inject(LabResourceDetailState, { optional: true });
  private clipboardService = inject(FlClipboardService);
  private actionService = inject(FlPortalActionsService);

  treeControl: FlFlatTreeControl<LabResourceViewFolderContentFlat>;

  dataSource: MatTreeFlatDataSource<LabResourceViewFolderContent, LabResourceViewFolderContentFlat>;

  constructor() {
    super();
  }

  private _transformer = (
    node: LabResourceViewFolderContent,
    level: number
  ): LabResourceViewFolderContentFlat => {
    return {
      name: node.name,
      resource_model_id: node.resource_model_id,
      isFolder: !!node.children && node.children.length > 0,
      level: level,
      isLoading: false,
    };
  };

  hasChild = (_: number, node: LabResourceViewFolderContentFlat): boolean => node.isFolder;

  ngOnInit(): void {
    this.treeControl = new FlFlatTreeControl<LabResourceViewFolderContentFlat>(
      (node) => node.level,
      (node) => node.isFolder
    );

    // object to flatten tree
    const treeFlattener: MatTreeFlattener<LabResourceViewFolderContent, LabResourceViewFolderContentFlat> =
      new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.isFolder,
        (node) => node.children
      );

    // create the datasource and set data
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener);
    this.dataSource.data = this.view.data.content.children;
  }

  // open the dialog to select the node type
  extractNode(node: LabResourceViewFolderContentFlat): void {
    const input: LabFsNodeTypesSelectionDialogInput = {
      dialogMode: node.isFolder ? 'folder' : 'files',
      filenames: [node.name],
      helpText: 'biox.extract_fs_node_help',
    };

    this.dialogService
      .openSmallDialog(LabFsNodeTypesSelectionDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.selectNodeTypeClosed(result, node));
  }

  private selectNodeTypeClosed(
    result: LabFsNodeTypesSelectionDialogResult,
    node: LabResourceViewFolderContentFlat
  ): void {
    if (result == null) return;

    const path: string = this.getNodePath(node);
    const typingName = result.uploadMode === 'files' ? result.fileTypingNames[0] : result.folderTypingName;

    node.isLoading = true;
    this.fileService.extractNode(this.resourceId, path, typingName).subscribe({
      next: (resource) => this.extractFileSuccess(node, resource),
      error: () => (node.isLoading = false),
    });
  }

  private extractFileSuccess(node: LabResourceViewFolderContentFlat, resource: LabResource): void {
    node.isLoading = false;
    node.resource_model_id = resource.id;
    this.routerService.navigateToResourceDetail(resource.id);
  }

  // retrieve the node full path by calling ancestors, with '/' separator
  private getNodePath(node: LabResourceViewFolderContentFlat): string {
    let path: string = null;
    let currentNode: LabResourceViewFolderContentFlat = node;
    while (currentNode) {
      if (path == null) {
        path = currentNode.name;
      } else {
        path = currentNode.name + '/' + path;
      }
      currentNode = this.treeControl.getAncestor(currentNode);
    }
    return path;
  }

  // use to open menu on right click
  openMenu(node: LabResourceViewFolderContentFlat, event: MouseEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    const menuDynamic: FlMenuDynamic[] = [];

    //TODO : this only work when the view is under resource state
    if (!node.isFolder && this.resourceState) {
      // button to extract the node
      menuDynamic.push({
        type: 'button',
        text: {
          text: 'biox.folder_view_sub_files',
          translateText: true,
        },
        onClick: () => this.callFileView(node),
        icon: 'visibility',
      });
    }

    if (node.resource_model_id) {
      menuDynamic.push({
        type: 'link',
        text: { text: 'resource', translateText: true },
        link: LabRouterService.getResourceDetailRoute(node.resource_model_id),
        icon: 'resource',
      });
    } else {
      // button to extract the node
      menuDynamic.push({
        type: 'button',
        text: {
          text: node.isFolder ? 'biox.folder_extract_folder' : 'biox.folder_extract_file',
          translateText: true,
        },
        onClick: () => this.extractNode(node),
        icon: 'drive_file_move',
      });
    }

    // button to download
    menuDynamic.push({
      type: 'button',
      text: {
        text: 'biox.download_folder_sub_node',
        translateText: true,
      },
      onClick: () => this.downloadFolderSubFile(node),
      icon: 'cloud_download',
    });

    // button to copy the node path
    menuDynamic.push({
      type: 'button',
      text: {
        text: 'biox.folder_copy_node_path',
        translateText: true,
      },
      onClick: () =>
        this.clipboardService.copy(this.getNodePath(node), {
          text: 'biox.folder_node_path_copied',
          translateText: true,
        }),
      icon: 'content_copy',
    });

    this.menuDynamicService.openDynamicMenuAbsolute(menuDynamic, event);
  }

  // open the dialog to select the node type
  private callFileView(node: LabResourceViewFolderContentFlat): void {
    this.resourceState.callView(
      this.fileService.callFolderSubFileView(this.resourceId, this.getNodePath(node)),
      node.name
    );
  }

  private downloadFolderSubFile(node: LabResourceViewFolderContentFlat): void {
    const action: FlPortalAction = {
      type: 'download-folder-sub-node',
      action: this.fileService.downloadFolderSubFile(this.resourceId, this.getNodePath(node)),
      text: { text: 'biox.folder_sub_node_downloading', translateText: true },
    };

    this.actionService.addAction(action);
  }
}
