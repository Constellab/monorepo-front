import { Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
  CaHierarchyObjectWithChildren
} from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { FlFlatTreeControl } from '@monorepo/front-core-lib';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CaNotificationType } from '../../../../model/entities/ca-notification.class';
import { combineLatest, Observable } from 'rxjs';
import { ClSubscriptionHandler } from '@monorepo/core-lib';

interface CaFolderFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  isSelected: boolean;
  objectType: CaHierarchyObjectType;
  parentId: string;
}

@Component({
  selector: 'ca-hierarchy-object-tree',
  templateUrl: './ca-hierarchy-object-tree.component.html',
  styleUrl: './ca-hierarchy-object-tree.component.scss'
})
export class CaHierarchyObjectTreeComponent implements OnInit, OnDestroy {

  @Input({ required: true }) hierarchyObjects$: Observable<CaHierarchyObjectWithChildren[]>;

  @Input() selectedObject$: Observable<string>;

  getRoute = input.required<(node: CaHierarchyObject) => string>();

  notificationObjectType = input<CaNotificationType>();

  treeControl: FlFlatTreeControl<CaFolderFlatNode, string> = new FlFlatTreeControl<CaFolderFlatNode, string>(
    node => node.level, node => node.expandable, {
      trackBy: node => node.id
    });

  private transformer = (node: CaHierarchyObjectWithChildren, level: number): CaFolderFlatNode => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      level: level,
      name: node.name,
      isSelected: false,
      objectType: node.objectType,
      parentId: node.parentId
    };
  };

  // object to flatten tree
  treeFlattener: MatTreeFlattener<CaHierarchyObjectWithChildren, CaFolderFlatNode, string> = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable,
    node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener, []);


  hasChild = (_: number, node: CaFolderFlatNode): boolean => node.expandable;

  private subscription = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.subscription.add(this.hierarchyObjects$.subscribe(
      hierarchyObjects => this.dataSource.data = hierarchyObjects
    ));

    // when the list of object or the selected object are update, we refresh the expand and selected attribute
    this.subscription.add(combineLatest([this.selectedObject$, this.hierarchyObjects$]).subscribe(
      ([hierarchyObjectId]) => this.refreshSelectedAndExpand(hierarchyObjectId)
    ));
  }

  private refreshSelectedAndExpand(hierarchyObjectId: string): void {
    // cancel selection
    this.treeControl.dataNodes.forEach(n => n.isSelected = false);
    let node = this.treeControl.dataNodes.find(n => n.id === hierarchyObjectId);

    while (node) {
      node.isSelected = true;
      this.treeControl.expand(node);
      // also expand and select parents
      node = this.treeControl.getAncestor(node);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
