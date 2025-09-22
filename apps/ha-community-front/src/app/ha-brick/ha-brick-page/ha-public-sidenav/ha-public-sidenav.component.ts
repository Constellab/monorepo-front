import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component,
  inject,
  makeStateKey,
  OnInit,
  PLATFORM_ID,
  Signal,
  StateKey,
  TransferState,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FlFormDialogInput, FlTree } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, Observable } from 'rxjs';

import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaDocumentation } from '../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import { HaFolder } from '../../../ha-core/ha-model/ha-entities/ha-folder.class';
import {
  HaNode,
  HaNodeDTO,
  HaNodeType,
  HaNoteObjectsTreeDatasource,
} from '../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaDocumentationService } from '../../../ha-core/ha-service/ha-documentation.service';
import { HaFolderService } from '../../../ha-core/ha-service/ha-folder.service';
import { HaBrickPageState } from '../../state/ha-brick-page.state';
import { HaPublicSidenavCreateFormDialogComponent } from '../ha-public-sidenav-create-form-dialog/ha-public-sidenav-create-form-dialog.component';

@Component({
  selector: 'ha-public-sidenav',
  templateUrl: './ha-public-sidenav.component.html',
  styleUrls: ['./ha-public-sidenav.component.scss'],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    MatTree,
    MatTreeNodeDef,
    MatTreeNode,
    CdkDragHandle,
    TranslatePipe,
    MatTreeNodePadding,
    MatIconButton,
    CdkDropList,
    CdkDrag,
    MatTreeNodeToggle,
    MatTooltip,
  ],
})
export class HaPublicSidenavComponent implements OnInit {
  private brickService = inject(HaBrickService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contextMenuService = inject(FlMenuDynamicService);
  private documentationService = inject(HaDocumentationService);
  private folderService = inject(HaFolderService);
  private dialogService = inject(FlDialogService);
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);
  private portalActionsService = inject(FlPortalActionsService);
  private brickPageState = inject(HaBrickPageState);
  private translateService: FlTranslateService = inject(FlTranslateService);

  userHasEditRight = this.brickPageState.getUserHasEditRight();

  brickAndPathVersion$: Observable<[HaBrick, string]> = toObservable(this.brickPageState.brickAndPathVersion);

  pathVersion: Signal<string> = this.brickPageState.getBrickVersionPath();
  brick: Signal<HaBrick> = this.brickPageState.brick;

  menuOpen: boolean;
  openedMenu: FlOverlayRef;

  // expansion model tracks expansion state
  hoverId: string;

  dataSource$: HaNoteObjectsTreeDatasource = new HaNoteObjectsTreeDatasource();
  techDataSource$: HaNoteObjectsTreeDatasource = new HaNoteObjectsTreeDatasource();

  activatedRoute: ActivatedRoute = this.route;

  //TRANSFERSTATE
  DOCUMENTATIONS_KEY: StateKey<object>;
  TECH_DOCUMENTATION_KEY: StateKey<object>;

  parentDocFolderId: string;
  currentCompletePath: string;
  currentDocId: string;

  ngOnInit(): void {
    this.DOCUMENTATIONS_KEY = makeStateKey<object>('DOCUMENTATIONS_KEY');
    this.TECH_DOCUMENTATION_KEY = makeStateKey<object>('TECH_DOCUMENTATION_KEY');

    this.brickAndPathVersion$.subscribe(([brick, pathVersion]) => {
      if (!brick) return null;
      this.initCurrentCompletePath(pathVersion);
      this.init(brick, pathVersion);
      return brick;
    });
  }

  private initCurrentCompletePath(pathVersion: string): void {
    this.currentCompletePath = this.router.url.split(pathVersion)[1];
    this.currentDocId = this.currentCompletePath.split('/').pop();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentCompletePath = event.url.split(pathVersion)[1];
      });
  }

  private init(brick: HaBrick, pathVersion: string): void {
    this.getTechnicalDocumentations(brick, pathVersion);
    this.getDocumentations(brick, pathVersion);
  }

  private getTechnicalDocumentations(brick: HaBrick, pathVersion: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.TECH_DOCUMENTATION_KEY)) {
      const data = this.transferState.get(this.TECH_DOCUMENTATION_KEY, null) as HaNode;
      this.transferState.remove(this.TECH_DOCUMENTATION_KEY);
      this.onTechDocumentationsData(data?.children);
      return;
    }
    this.brickService.getTechnicalDocumentation(brick.id, pathVersion).subscribe((data) => {
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.TECH_DOCUMENTATION_KEY)) {
        this.transferState.set(this.TECH_DOCUMENTATION_KEY, data);
      }
      this.onTechDocumentationsData(data?.children);
    });
  }

  private getDocumentations(brick: HaBrick, pathVersion: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOCUMENTATIONS_KEY)) {
      const data = this.transferState.get(this.DOCUMENTATIONS_KEY, null) as HaNode;
      this.transferState.remove(this.DOCUMENTATIONS_KEY);
      this.onDocumentationsData(data.children);
      return;
    }
    this.brickService.getBrickDocs(brick.id, pathVersion).subscribe((data) => {
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.DOCUMENTATIONS_KEY)) {
        this.transferState.set(this.DOCUMENTATIONS_KEY, data);
      }
      this.onDocumentationsData(data.children);
    });
  }

  private onDocumentationsData(nodes: HaNode[]): void {
    const children = [];
    this.parentDocFolderId = nodes[0].parentId;
    for (const child of nodes) {
      child.parentId = null;
      children.push(child);
    }
    this.dataSource$.addNodeObjectsWithChildren(children);
  }

  private onTechDocumentationsData(nodes: HaNode[]): void {
    if (!nodes || nodes?.length == 0) return;
    const children = [];
    const techFolder = new HaNode(
      'technical-folder',
      null,
      null,
      this.translateService.translate('technical_documentations'),
      0,
      null,
      []
    );
    for (const child of nodes) {
      child.parentId = 'technical-folder';
      techFolder.children.push(child);
    }
    children.push(techFolder);
    this.techDataSource$.addNodeObjectsWithChildren(children);
  }

  onClickMenu(event: MouseEvent, isFolder: boolean, hasChild: boolean = false, id?: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.menuOpen) {
      this.openedMenu.overlayRef.detach();
    }
    if (!id) {
      this.brickService.getRootFolderId(this.brick()?.id, this.pathVersion()).subscribe((res) => {
        this.openCreateDialog(res.id);
      });
    } else {
      this.openedMenu = this.contextMenuService.openDynamicMenuFromMouseEvent(
        this.getContextMenuConfig(isFolder, id, hasChild),
        event
      );
      this.menuOpen = true;
    }
  }

  private getContextMenuConfig(isFolder: boolean, id?: string, hasChild: boolean = false): FlMenuDynamic[] {
    if (isFolder) {
      return [
        {
          type: 'button',
          text: { text: 'create', translateText: true },
          icon: 'add',
          onClick: () => this.openCreateDialog(id),
        },
        {
          type: 'button',
          text: { text: 'edit_title', translateText: true },
          icon: 'edit',
          onClick: () => this.prepareEditDialog(id, isFolder),
        },
        {
          type: 'button',
          text: { text: 'delete', translateText: true },
          icon: 'delete',
          onClick: () => this.openResourceDelete(id, isFolder),
          disabled: hasChild,
        },
      ];
    }
    return [
      {
        type: 'button',
        text: { text: 'edit_title', translateText: true },
        icon: 'edit',
        onClick: () => this.prepareEditDialog(id, isFolder),
      },
      {
        type: 'button',
        text: { text: 'delete', translateText: true },
        icon: 'delete',
        onClick: () => this.openResourceDelete(id, isFolder),
      },
    ];
  }

  openResourceDelete(id: string, isFolder: boolean): void {
    const input: FlConfirmDialogInput = {
      title: 'confirm_deletion',
      content: 'confirm_deletion_message',
      observable: isFolder ? this.folderService.deleteById(id) : this.documentationService.deleteById(id),
      successMessage: isFolder ? 'folder_deleted' : 'documentation_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        this.onCloseConfirmDialog(res);
      });
  }

  private onCloseConfirmDialog(res: FlConfirmDialogResult): void {
    if (res.choice) {
      this.brickService.getBrickDocs(this.brick()?.id, this.pathVersion()).subscribe(() => {});
    }
  }

  private openCreateDialog(folderId: string): void {
    const input: FlFormDialogInput<HaNodeDTO> = {
      mode: 'create',
      object: {
        id: null,
        path: null,
        title: null,
        isFolder: null,
        folderId: folderId,
      } as HaNodeDTO,
    };

    this.openSmallDialog(input);
  }

  private openSmallDialog(input: any): void {
    this.dialogService
      .openSmallDialog(HaPublicSidenavCreateFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((res) => {
        if (res != null) {
          if (res[1] == HaNodeType.TEC) {
            this.portalActionsService
              .addAction({
                action: this.brickService.importTechnicalDocumentation({
                  brickName: this.brick().name,
                  importFile: res[0],
                }),
                text: {
                  text: 'updating_brick_tech_doc',
                  translateText: true,
                },
                type: 'brick_tech_doc',
              })
              .subscribe((res) => {
                if (res) {
                  this.getTechnicalDocumentations(this.brick(), this.pathVersion());
                }
              });
          } else {
            this.getDocumentations(this.brick(), this.pathVersion());
          }
        }
      });
  }

  private prepareEditDialog(id: string, isFolder: boolean): void {
    if (isFolder) {
      this.folderService.getById(id).subscribe((f) => {
        this.createEditDialog(isFolder, f);
      });
    } else {
      this.documentationService.getById(id).subscribe((d) => {
        this.createEditDialog(isFolder, d);
      });
    }
  }

  private createEditDialog(isFolder: boolean, object: HaFolder | HaDocumentation): void {
    const node: HaNodeDTO = new HaNodeDTO();
    node.id = object.id;
    node.path = object.path;
    node.isFolder = isFolder;
    node.title = object.title;

    const input: FlFormDialogInput<HaNodeDTO> = {
      mode: 'update',
      object: node,
    };

    this.openSmallDialog(input);
  }

  isDocNodeSelected(node: HaNode): boolean {
    if (!this.currentCompletePath || this.currentCompletePath.length == 0) return false;

    let completePath: string = this.currentCompletePath.split('doc/')[1];
    if (completePath == null) return false;
    if (completePath.includes('technical-folder')) {
      return completePath + '/' == node.completePath;
    }
    const completePathSplit = completePath.split('/');
    // remove last fragment
    completePath = completePathSplit.slice(0, completePathSplit.length - 1).join('/') + '/';
    return completePath == node.completePath;
  }

  drop(event: CdkDragDrop<MatTree<FlTree<HaNode>>, MatTree<FlTree<HaNode>>, FlTree<HaNode>>): void {
    const tree = event.container.data;
    const node = event.item.data;
    const visibleNodes: FlTree<HaNode>[] = this.dataSource$.getVisibleNodes(tree);

    let newParentId: string = null;
    if (event.currentIndex > 0) {
      for (let i = event.currentIndex - (event.currentIndex > event.previousIndex ? 0 : 1); i >= 0; i--) {
        if (visibleNodes[i].object.children && tree.isExpanded(visibleNodes[i])) {
          newParentId = visibleNodes[i].id;
          break;
        }
        if (!visibleNodes[i].object.children) {
          newParentId = visibleNodes[i].object.parentId;
          break;
        }
      }
    }

    const nodesBeforeInTheSameFolder = visibleNodes.filter(
      (n) => n.object.parentId == newParentId && visibleNodes.indexOf(n) < event.currentIndex
    );

    const newOrder = nodesBeforeInTheSameFolder.length;

    const oldParentId = node.object.parentId;

    const body = {
      nodeId: node.object.id,
      nodeType: node.object.children ? 'FOLDER' : 'DOCUMENTATION',
      oldOrder: node.object.order,
      newOrder: newOrder,
      oldParentId: oldParentId ?? this.parentDocFolderId,
      newParentId: newParentId ?? this.parentDocFolderId,
      mainFolderId: this.parentDocFolderId,
    };

    if (newParentId != oldParentId) {
      const nodesToMoveDown = visibleNodes.filter(
        (n) => n.object.parentId == newParentId && n.object.order >= newOrder
      );
      this.moveDownNodes(nodesToMoveDown);
    } else {
      if (node.object.order > newOrder) {
        const nodesToMoveDown = visibleNodes.filter(
          (n) =>
            n.object.parentId == newParentId &&
            n.object.order >= newOrder &&
            n.object.order < node.object.order
        );
        this.moveDownNodes(nodesToMoveDown);
      } else {
        const nodesToMoveUp = visibleNodes.filter(
          (n) =>
            n.object.parentId == newParentId &&
            n.object.order <= newOrder &&
            n.object.order > node.object.order
        );
        this.moveUpNodes(nodesToMoveUp);
      }
    }

    node.object.parentId = newParentId;
    node.object.order = newOrder;

    this.dataSource$.updateNodeLocation(node.object, oldParentId, newParentId);

    this.folderService.updateTree(body).subscribe((node) => {
      if (node) {
        this.getDocumentations(this.brick(), this.pathVersion());
      }
    });
  }

  private moveUpNodes(nodes: FlTree<HaNode>[]): void {
    for (const node of nodes) {
      node.object.order -= 1;
      this.dataSource$.updateNodeInfo(node.object);
    }
  }

  private moveDownNodes(nodes: FlTree<HaNode>[]): void {
    for (const node of nodes) {
      node.object.order += 1;
      this.dataSource$.updateNodeInfo(node.object);
    }
  }

  expandNode(node: FlTree<HaNode>): void {
    node.object.isExpanded = true;
    this.dataSource$.updateNodeInfo(node.object);
  }

  collapseNode(node: FlTree<HaNode>): void {
    node.object.isExpanded = false;
    this.dataSource$.updateNodeInfo(node.object);
  }

  isSelected(node: FlTree<HaNode>): boolean {
    console.log('isSelected', this.currentCompletePath, node.object.completePath);
    if (this.currentCompletePath.includes(node.object.id)) return true;

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (this.isSelected(child)) return true;
      }
    }
    return false;
  }
}
