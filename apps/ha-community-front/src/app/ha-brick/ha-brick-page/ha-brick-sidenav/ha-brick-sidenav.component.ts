import { isPlatformBrowser, isPlatformServer, NgClass } from '@angular/common';
import {
  Component,
  effect,
  inject,
  makeStateKey,
  PLATFORM_ID,
  Signal,
  StateKey,
  TransferState,
} from '@angular/core';
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
import { filter } from 'rxjs';

import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaDocumentation } from '../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import { HaFolder } from '../../../ha-core/ha-model/ha-entities/ha-folder.class';
import {
  HaNode,
  HaNodeDTO,
  HaNodeObjectsTreeDatasource,
  HaNodeType,
} from '../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaDocumentationService } from '../../../ha-core/ha-service/ha-documentation.service';
import { HaFolderService } from '../../../ha-core/ha-service/ha-folder.service';
import { HaBrickPageState } from '../../state/ha-brick-page.state';
import { HaBrickSidenavCreateFormDialogComponent } from '../ha-brick-sidenav-create-form-dialog/ha-brick-sidenav-create-form-dialog.component';
import {
  HaBrickSidenavTreeComponent,
  HaBrickSidenavTreeEvent,
  HaBrickSidenavTreeEventType,
} from '../ha-brick-sidenav-tree/ha-brick-sidenav-tree.component';

@Component({
  selector: 'ha-brick-sidenav',
  templateUrl: './ha-brick-sidenav.component.html',
  styleUrls: ['./ha-brick-sidenav.component.scss'],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    MatTree,
    MatTreeNodeDef,
    MatTreeNode,
    TranslatePipe,
    MatTreeNodePadding,
    MatIconButton,
    MatTreeNodeToggle,
    MatTooltip,
    HaBrickSidenavTreeComponent,
    NgClass,
  ],
})
export class HaBrickSidenavComponent {
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

  brickAndPathVersion = this.brickPageState.brickAndPathVersion;

  pathVersion: Signal<string> = this.brickPageState.getBrickVersionPath();
  brick: Signal<HaBrick> = this.brickPageState.brick;

  menuOpen: boolean;
  openedMenu: FlOverlayRef;

  // expansion model tracks expansion state
  hoverId: string;

  dataSource$: HaNodeObjectsTreeDatasource = new HaNodeObjectsTreeDatasource();
  techDataSource$: HaNodeObjectsTreeDatasource = new HaNodeObjectsTreeDatasource();

  activatedRoute: ActivatedRoute = this.route;

  TECH_DOCUMENTATION_KEY: StateKey<object>;

  parentDocFolderId: string;
  currentCompletePath: string;
  currentDocId: string;

  constructor() {
    effect(() => {
      this.TECH_DOCUMENTATION_KEY = makeStateKey<object>('TECH_DOCUMENTATION_KEY');
      const brickAndPathVersion = this.brickAndPathVersion();
      const brick = brickAndPathVersion[0];
      const pathVersion = brickAndPathVersion[1];
      if (!brick) return;
      this.initCurrentCompletePath(pathVersion);
      this.init(brick, pathVersion);
    });
  }

  getRoute: (node: HaNode) => string = (node: HaNode) => {
    return 'doc/' + node.completePath;
  };

  private initCurrentCompletePath(pathVersion: string): void {
    this.currentCompletePath = this.router.url?.split(pathVersion)[1];
    this.currentDocId = this.currentCompletePath?.split('/').pop();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentCompletePath = event.url.split(pathVersion)[1];
        this.currentDocId = this.currentCompletePath?.split('/').pop();
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
    this.brickService.getBrickDocs(brick.id, pathVersion).subscribe((data) => {
      this.parentDocFolderId = data.id;
      this.onDocumentationsData(data.children);
    });
  }

  private onDocumentationsData(nodes: HaNode[]): void {
    nodes.map((n) => {
      n.parentId = null;
      return n;
    });
    this.dataSource$.addNodeObjectsWithChildren(nodes);
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

  onDocumentationTreeEvent(event: HaBrickSidenavTreeEvent): void {
    switch (event.type) {
      case HaBrickSidenavTreeEventType.CREATE:
        this.openCreateDialog(event.id);
        break;
      case HaBrickSidenavTreeEventType.EDIT_TITLE:
        this.prepareEditDialog(event.id, event.isFolder);
        break;
      case HaBrickSidenavTreeEventType.DELETE:
        this.openResourceDelete(event.id, event.isFolder);
        break;
    }
  }

  onRefreshDocumentationTree(): void {
    this.getDocumentations(this.brick(), this.pathVersion());
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
          color: 'warn',
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
        color: 'warn',
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
      .openSmallDialog(HaBrickSidenavCreateFormDialogComponent, { data: input })
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

  expandNode(node: FlTree<HaNode>): void {
    node.object.isExpanded = true;
    this.dataSource$.updateNodeInfo(node.object);
  }

  collapseNode(node: FlTree<HaNode>): void {
    node.object.isExpanded = false;
    this.dataSource$.updateNodeInfo(node.object);
  }
}
