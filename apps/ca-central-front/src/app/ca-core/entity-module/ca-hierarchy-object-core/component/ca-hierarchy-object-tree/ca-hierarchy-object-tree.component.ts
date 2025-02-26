import { Component, inject, Input, input, OnDestroy, OnInit, Signal, viewChild } from '@angular/core';
import {
  CaHierarchyObjectSimple,
  CaHierarchyObjectsTreeDatasource,
} from '../../../../model/entities/folder/ca-hierarchy-object.class';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { CaNotificationType } from '../../../../model/entities/ca-notification.class';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CaHierarchyObjectIconComponent } from '../ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { RouterLink } from '@angular/router';
import { CaNotificationMarkDirective } from '../../../ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { Observable, switchMap } from 'rxjs';
import { NgClass } from '@angular/common';
import { FlTree } from '@monorepo/front-core-lib/fl-core';
import { CaFolderService } from '../../../../service-api/ca-folder.service';

@Component({
  selector: 'ca-hierarchy-object-tree',
  templateUrl: './ca-hierarchy-object-tree.component.html',
  styleUrl: './ca-hierarchy-object-tree.component.scss',
  imports: [
    MatTree,
    MatTreeNodeDef,
    MatTreeNode,
    MatTreeNodePadding,
    MatIconButton,
    MatTreeNodeToggle,
    MatIcon,
    CaHierarchyObjectIconComponent,
    RouterLink,
    CaNotificationMarkDirective,
    NgClass,
  ],
})
export class CaHierarchyObjectTreeComponent implements OnInit, OnDestroy {
  @Input() hierarchyObjects$: Observable<CaHierarchyObjectSimple[]>;

  hierarchyObjects = input.required<CaHierarchyObjectsTreeDatasource>();

  @Input({ required: true }) selectedObject$: Observable<string>;

  getRoute = input.required<(node: CaHierarchyObjectSimple) => string>();

  notificationObjectType = input<CaNotificationType>();

  enableLazyChildrenLoading = input<boolean>(false);

  matTree: Signal<MatTree<FlTree<CaHierarchyObjectSimple>>> = viewChild.required(MatTree);

  selectedObjectAndParent: FlTree<CaHierarchyObjectSimple>[] = [];

  private subscription = new ClSubscriptionHandler();

  private folderService = inject(CaFolderService);

  ngOnInit(): void {
    // use a timeout to let the matTree be initialized, otherwise the expand() doesn't work well
    setTimeout(() => {
      this.subscription.add(
        this.selectedObject$
          .pipe(switchMap((selectedObjectId) => this.hierarchyObjects().findAncestorsNode$(selectedObjectId)))
          .subscribe((ancestors) => this.refreshSelectedAndExpand(ancestors))
      );
    }, 0);
  }

  private refreshSelectedAndExpand(ancestors: FlTree<CaHierarchyObjectSimple>[]): void {
    this.selectedObjectAndParent = ancestors;

    // expand all the ancestors
    for (const ancestor of ancestors) {
      // don't expand if the children are not loaded
      if (ancestor.children != null) {
        this.matTree().expand(ancestor);
      }
    }
  }

  isSelected(node: FlTree<CaHierarchyObjectSimple>): boolean {
    return this.selectedObjectAndParent.find((n) => n.id === node.id) != null;
  }

  onExpand(node: FlTree<CaHierarchyObjectSimple>): void {
    if (this.enableLazyChildrenLoading() && node.children == null) {
      this.folderService.getChildFolders(node.id).subscribe({
        next: (children) => this.onNewNode(children),
        error: () => {
          // mark children as not loaded
          if (node.children?.length === 0) {
            node.children = undefined;
          }
        },
      });
      // mark the children as loaded
      node.children = [];
    }
  }

  private onNewNode(children: CaHierarchyObjectSimple[]): void {
    this.hierarchyObjects().addHierarchyObjects(children);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
