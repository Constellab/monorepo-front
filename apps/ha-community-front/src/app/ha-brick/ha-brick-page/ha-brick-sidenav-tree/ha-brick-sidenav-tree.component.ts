import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  Signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { RouterLink } from '@angular/router';
import { FlTree } from '@monorepo/front-core-lib/fl-core';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { Subscription } from 'rxjs';

import { HaNode, HaNodeObjectsTreeDatasource } from '../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaFolderService } from '../../../ha-core/ha-service/ha-folder.service';
import { HaBrickPageState } from '../../state/ha-brick-page.state';

export enum HaBrickSidenavTreeEventType {
  CREATE = 'CREATE',
  EDIT_TITLE = 'EDIT_TITLE',
  DELETE = 'DELETE',
}

export interface HaBrickSidenavTreeEvent {
  type: HaBrickSidenavTreeEventType;
  isFolder?: boolean;
  id: string;
}

@Component({
  selector: 'ha-brick-sidenav-tree',
  templateUrl: './ha-brick-sidenav-tree.component.html',
  styleUrls: ['./ha-brick-sidenav-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatIcon,
    MatIconButton,
    MatTreeNodeToggle,
    RouterLink,
  ],
})
export class HaBrickSidenavTreeComponent implements OnDestroy {
  private brickPageState = inject(HaBrickPageState);
  private contextMenuService = inject(FlMenuDynamicService);
  private folderService = inject(HaFolderService);

  brick = this.brickPageState.brick;

  sidenavObjects = input.required<HaNodeObjectsTreeDatasource>();

  selectedObject = input.required<string>();

  getRoute = input.required<(node: HaNode) => string>();

  dragAndDropDisabled = input<boolean>(true);

  canEdit = input<boolean | null>(false);

  showActionIcons = input<boolean>(false);

  parentDocFolderId = input.required<string>();

  matTree: Signal<MatTree<FlTree<HaNode>>> = viewChild.required(MatTree);

  menuButtonEvent = output<HaBrickSidenavTreeEvent>();

  refreshDatasource = output<void>();

  hoverId: string | null = null;

  selectedObjectAndParent: FlTree<HaNode>[] = [];

  menuOpen: boolean;

  openedMenu: FlOverlayRef;

  private ancestorsSubscription: Subscription;

  constructor() {
    effect(() => {
      const selectedObjectId = this.selectedObject();
      untracked(() => {
        this.ancestorsSubscription?.unsubscribe();
        this.ancestorsSubscription = this.sidenavObjects()
          .findAncestorsNode$(selectedObjectId)
          .subscribe((ancestors) => this.refreshSelectedAndExpand(ancestors));
      });
    });
  }

  private refreshSelectedAndExpand(ancestors: FlTree<HaNode>[]): void {
    this.selectedObjectAndParent = ancestors;

    // expand all the ancestors
    for (const ancestor of ancestors) {
      // don't expand if the children are not loaded
      if (ancestor.childrenAreLoaded()) {
        this.matTree().expand(ancestor);
      }
    }
  }

  isSelected(node: FlTree<HaNode>): boolean {
    return this.selectedObjectAndParent.find((n) => n.id === node.id) != null;
  }

  drop(event: CdkDragDrop<MatTree<FlTree<HaNode>>, MatTree<FlTree<HaNode>>, FlTree<HaNode>>): void {
    const tree = event.container.data;
    const node = event.item.data;
    const visibleNodes: FlTree<HaNode>[] = this.sidenavObjects().getVisibleNodes(tree);

    const newParentId = this.findNewParentId(event, tree, visibleNodes);

    const nodesBeforeInTheSameFolder = visibleNodes.filter(
      (n) => n.object.parentId == newParentId && visibleNodes.indexOf(n) < event.currentIndex
    );

    const newOrder = nodesBeforeInTheSameFolder.length;

    const oldParentId = node.object.parentId;
    const oldOrder = node.object.order;

    const mainFolderId = this.parentDocFolderId();
    if (mainFolderId == null) {
      return;
    }

    const body = {
      nodeId: node.object.id,
      nodeType: node.object.children ? 'FOLDER' : 'DOCUMENTATION',
      oldOrder: oldOrder,
      newOrder: newOrder,
      oldParentId: oldParentId ?? mainFolderId,
      newParentId: newParentId ?? mainFolderId,
      mainFolderId: mainFolderId,
    };

    this.reorderSiblings(visibleNodes, oldParentId, newParentId, oldOrder, newOrder);

    node.object.parentId = newParentId;
    node.object.order = newOrder;

    this.sidenavObjects().updateNodeLocation(node.object, oldParentId, newParentId);

    this.folderService.updateTree(body).subscribe((node) => {
      if (node) {
        this.refreshDatasource.emit();
      }
    });
  }

  /**
   * The node dropped becomes a child of the closest node above it: the first expanded folder found
   * while walking up the visible nodes, or the parent of the first non-folder found there.
   */
  private findNewParentId(
    event: CdkDragDrop<MatTree<FlTree<HaNode>>, MatTree<FlTree<HaNode>>, FlTree<HaNode>>,
    tree: MatTree<FlTree<HaNode>>,
    visibleNodes: FlTree<HaNode>[]
  ): string | null {
    if (event.currentIndex <= 0) {
      return null;
    }

    const startIndex = event.currentIndex - (event.currentIndex > event.previousIndex ? 0 : 1);

    for (let i = startIndex; i >= 0; i--) {
      const candidate = visibleNodes[i];
      if (!candidate.object.children) {
        return candidate.object.parentId;
      }
      if (tree.isExpanded(candidate)) {
        return candidate.id;
      }
    }

    return null;
  }

  /** Shift the orders of the nodes the dropped node moved past, so that they stay contiguous. */
  private reorderSiblings(
    visibleNodes: FlTree<HaNode>[],
    oldParentId: string | null,
    newParentId: string | null,
    oldOrder: number,
    newOrder: number
  ): void {
    if (newParentId != oldParentId) {
      this.moveDownNodes(
        visibleNodes.filter((n) => n.object.parentId == newParentId && n.object.order >= newOrder)
      );
      return;
    }

    if (oldOrder > newOrder) {
      this.moveDownNodes(
        visibleNodes.filter(
          (n) => n.object.parentId == newParentId && n.object.order >= newOrder && n.object.order < oldOrder
        )
      );
      return;
    }

    this.moveUpNodes(
      visibleNodes.filter(
        (n) => n.object.parentId == newParentId && n.object.order <= newOrder && n.object.order > oldOrder
      )
    );
  }

  onClickMenu(event: MouseEvent, isFolder: boolean, hasChild: boolean = false, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.menuOpen) {
      this.openedMenu.overlayRef.detach();
    }
    this.openedMenu = this.contextMenuService.openDynamicMenuFromMouseEvent(
      this.getContextMenuConfig(isFolder, id, hasChild),
      event
    );
    this.menuOpen = true;
  }

  private moveUpNodes(nodes: FlTree<HaNode>[]): void {
    for (const node of nodes) {
      node.object.order -= 1;
    }
  }

  private moveDownNodes(nodes: FlTree<HaNode>[]): void {
    for (const node of nodes) {
      node.object.order += 1;
    }
  }

  private getContextMenuConfig(isFolder: boolean, id: string, hasChild: boolean = false): FlMenuDynamic[] {
    if (isFolder) {
      return [
        {
          type: 'button',
          text: { text: 'create', translateText: true },
          icon: 'add',
          onClick: () =>
            this.menuButtonEvent.emit({
              type: HaBrickSidenavTreeEventType.CREATE,
              id: id,
            }),
        },
        {
          type: 'button',
          text: { text: 'edit_title', translateText: true },
          icon: 'edit',
          onClick: () =>
            this.menuButtonEvent.emit({
              type: HaBrickSidenavTreeEventType.EDIT_TITLE,
              id: id,
              isFolder: isFolder,
            }),
        },
        {
          type: 'button',
          text: { text: 'delete', translateText: true },
          icon: 'delete',
          color: 'warn',
          onClick: () =>
            this.menuButtonEvent.emit({
              type: HaBrickSidenavTreeEventType.DELETE,
              id: id,
              isFolder: isFolder,
            }),
          disabled: hasChild,
        },
      ];
    }
    return [
      {
        type: 'button',
        text: { text: 'edit_title', translateText: true },
        icon: 'edit',
        onClick: () =>
          this.menuButtonEvent.emit({
            type: HaBrickSidenavTreeEventType.EDIT_TITLE,
            id: id,
            isFolder: isFolder,
          }),
      },
      {
        type: 'button',
        text: { text: 'delete', translateText: true },
        icon: 'delete',
        color: 'warn',
        onClick: () =>
          this.menuButtonEvent.emit({
            type: HaBrickSidenavTreeEventType.DELETE,
            id: id,
            isFolder: isFolder,
          }),
      },
    ];
  }

  ngOnDestroy(): void {
    this.ancestorsSubscription?.unsubscribe();
  }
}
