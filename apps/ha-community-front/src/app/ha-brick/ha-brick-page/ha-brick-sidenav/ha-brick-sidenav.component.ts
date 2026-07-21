import { isPlatformBrowser, isPlatformServer, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  makeStateKey,
  PLATFORM_ID,
  Signal,
  StateKey,
  TransferState} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentationService = inject(HaDocumentationService);
  private folderService = inject(HaFolderService);
  private dialogService = inject(FlDialogService);
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);
  private portalActionsService = inject(FlPortalActionsService);
  private brickPageState = inject(HaBrickPageState);
  private translateService = inject(FlTranslateService);

  userHasEditRight = this.brickPageState.userHasEditRight;

  pathVersion: Signal<string> = this.brickPageState.pathVersion;
  brick: Signal<HaBrick> = this.brickPageState.brick;

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.url)
    ),
    { initialValue: this.router.url }
  );

  currentDocId = computed(() => {
    const pathVersion = this.pathVersion();
    const url = this.currentUrl();
    if (!url || !pathVersion) return '';
    const segment = url.split(pathVersion)[1];
    return segment?.split('/').pop() ?? '';
  });

  dataSource$ = new HaNodeObjectsTreeDatasource();
  techDataSource$ = new HaNodeObjectsTreeDatasource();

  private DOCS_KEY: StateKey<object> = makeStateKey<object>('DOCS_KEY');

  private techDocsLoaded = false;
  private currentBrick: HaBrick;
  private currentPathVersion: string;

  parentDocFolderId: string;

  constructor() {
    effect(() => {
      const brick = this.brick();
      const pathVersion = this.pathVersion();
      if (!brick || !pathVersion) return;
      this.dataSource$.clear();
      this.techDataSource$.clear();
      this.init(brick, pathVersion);
    });
  }

  getRoute: (node: HaNode) => string = (node: HaNode) => {
    return 'doc/' + node.completePath;
  };

  private init(brick: HaBrick, pathVersion: string): void {
    this.currentBrick = brick;
    this.currentPathVersion = pathVersion;
    this.getDocumentations(brick, pathVersion);
    this.initTechDocPlaceholder();
  }

  private initTechDocPlaceholder(): void {
    this.techDocsLoaded = false;
    const techFolder = new HaNode(
      'technical-folder',
      null,
      null,
      this.translateService.translate('technical_documentations'),
      0,
      null,
      []
    );
    this.techDataSource$.addNodeObjectsWithChildren([techFolder]);
  }

  private getTechnicalDocumentations(brick: HaBrick, pathVersion: string): void {
    this.brickService.getTechnicalDocumentation(brick.id, pathVersion).subscribe((data) => {
      this.onTechDocumentationsData(data?.children);
    });
  }

  private getDocumentations(brick: HaBrick, pathVersion: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOCS_KEY)) {
      const data = this.transferState.get(this.DOCS_KEY, null) as HaNode;
      this.transferState.remove(this.DOCS_KEY);
      this.parentDocFolderId = data.id;
      this.onDocumentationsData(data.children);
      return;
    }

    this.brickService.getBrickDocs(brick.id, pathVersion).subscribe((data) => {
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.DOCS_KEY)) {
        this.transferState.set(this.DOCS_KEY, data);
      }
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
    const techFolder = new HaNode(
      'technical-folder',
      null,
      null,
      this.translateService.translate('technical_documentations'),
      0,
      null,
      []
    );
    techFolder.isExpanded = true;
    for (const child of nodes) {
      child.parentId = 'technical-folder';
      techFolder.children.push(child);
    }
    this.techDataSource$.addNodeObjectsWithChildren([techFolder]);
  }

  onClickMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.brickService.getRootFolderId(this.brick()?.id, this.pathVersion()).subscribe((res) => {
      this.openCreateDialog(res.id);
    });
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
      this.getDocumentations(this.brick(), this.pathVersion());
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

  expandTechNode(node: FlTree<HaNode>): void {
    if (node.object.id === 'technical-folder' && !this.techDocsLoaded) {
      this.techDocsLoaded = true;
      this.getTechnicalDocumentations(this.currentBrick, this.currentPathVersion);
    }
    node.object.isExpanded = true;
    this.techDataSource$.updateNodeInfo(node.object);
  }

  collapseTechNode(node: FlTree<HaNode>): void {
    node.object.isExpanded = false;
    this.techDataSource$.updateNodeInfo(node.object);
  }
}
