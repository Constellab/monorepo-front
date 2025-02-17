import { Component, Input, input, OnDestroy, OnInit, viewChild } from '@angular/core';
import {
  CaHierarchyObject,
  CaHierarchyObjectWithChildren,
} from '../../../../model/entities/folder/ca-hierarchy-object.class';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { CaNotificationType } from '../../../../model/entities/ca-notification.class';
import { clRxjsDebug, ClSubscriptionHandler } from '@monorepo/core-lib';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CaHierarchyObjectIconComponent } from '../ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { RouterLink } from '@angular/router';
import { CaNotificationMarkDirective } from '../../../ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { FlDatasourceTree } from '@monorepo/front-core-lib/fl-core';
import { combineLatest, Observable } from 'rxjs';
import { NgClass } from '@angular/common';

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
  @Input({ required: true }) hierarchyObjects$: Observable<CaHierarchyObjectWithChildren[]>;

  @Input({ required: true }) selectedObject$: Observable<string>;

  datasource: FlDatasourceTree<CaHierarchyObjectWithChildren> =
    new FlDatasourceTree<CaHierarchyObjectWithChildren>();

  getRoute = input.required<(node: CaHierarchyObject) => string>();

  notificationObjectType = input<CaNotificationType>();

  matTree = viewChild.required(MatTree);

  selectedObjectAndParent: CaHierarchyObjectWithChildren[] = [];

  childrenAccessor = (node: CaHierarchyObjectWithChildren): CaHierarchyObjectWithChildren[] =>
    node.children ?? [];

  private subscription = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.subscription.add(
      this.hierarchyObjects$.subscribe((data) => {
        this.datasource.setData(data);
      })
    );

    // timeout required to correctly expand the tree on init in chat page
    setTimeout(() => {
      this.subscription.add(
        combineLatest([this.selectedObject$, this.datasource.connect()])
          .pipe(clRxjsDebug())
          .subscribe(([hierarchyObjectId]) => this.refreshSelectedAndExpand(hierarchyObjectId))
      );
    }, 0);
  }

  private refreshSelectedAndExpand(hierarchyObjectId: string): void {
    let node = this.datasource.findNode(hierarchyObjectId);

    const nodeAndParent: CaHierarchyObjectWithChildren[] = [];
    while (node) {
      this.matTree().expand(node);
      // also expand and select parents
      nodeAndParent.push(node);
      node = this.datasource.findParentNode(node.id);
    }

    this.selectedObjectAndParent = nodeAndParent;
  }

  isSelected(node: CaHierarchyObjectWithChildren): boolean {
    return this.selectedObjectAndParent.find((n) => n.id === node.id) != null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
