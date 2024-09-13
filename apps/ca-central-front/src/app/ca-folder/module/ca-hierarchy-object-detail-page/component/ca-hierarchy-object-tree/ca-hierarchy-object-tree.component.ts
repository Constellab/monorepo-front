import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlFlatTreeControl } from '@monorepo/front-core-lib';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {
  CaHierarchyObjectDetailState
} from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
  CaHierarchyObjectWithChildren
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

interface CaObjectFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  isSelected: boolean;
  objectType: CaHierarchyObjectType;
}

/**
 * Display the tree from the root folder of an object
 */
@Component({
  selector: 'ca-hierarchy-object-tree',
  templateUrl: './ca-hierarchy-object-tree.component.html',
  styleUrls: ['./ca-hierarchy-object-tree.component.scss']
})
export class CaHierarchyObjectTreeComponent implements OnInit, OnDestroy {

  rootFolder: CaHierarchyObjectWithChildren;
  treeControl: FlFlatTreeControl<CaObjectFlatNode, string>;
  dataSource: MatTreeFlatDataSource<CaHierarchyObjectWithChildren, CaObjectFlatNode>;

  isLoading: boolean = false;

  // use as saved for backup
  private currentAncestors: CaHierarchyObject[];
  private subscription: Subscription;

  private _transformer = (node: CaHierarchyObjectWithChildren, level: number): CaObjectFlatNode => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      level: level,
      name: node.name,
      isSelected: false,
      objectType: node.objectType
    };
  };

  hasChild = (_: number, node: CaObjectFlatNode): boolean => node.expandable;


  constructor(private state: CaHierarchyObjectDetailState) {
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.state.getFolderTree$().pipe(
      // as the tree start with the root, it only needs to be loaded once
    ).subscribe({
      next: folderTree => this.constructTree(folderTree),
      error: () => this.isLoading = false
    });


    this.subscription = this.state.getAncestorsFolders$().subscribe(
      ancestors => this.onAncestorChange(ancestors)
    );
  }


  private constructTree(folderTree
                          : CaHierarchyObjectWithChildren): void {
    this.rootFolder = folderTree;
    this.treeControl = new FlFlatTreeControl<CaObjectFlatNode, string>(
      node => node.level, node => node.expandable, {
        trackBy: node => node.id
      });

    // object to flatten tree
    const treeFlattener: MatTreeFlattener<CaHierarchyObjectWithChildren, CaObjectFlatNode, string> = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable,
      node => node.children);

    // create the datasource and set data
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener, folderTree.children);

    this.isLoading = false;

    // if the ancestors were already loaded, we need to update the tree
    if (this.currentAncestors != null) {
      this.onAncestorChange(this.currentAncestors);
    }

  }

  private onAncestorChange(ancestors: CaHierarchyObject[]): void {
    this.currentAncestors = ancestors;
    if (this.treeControl == null) return;

    // retrieve the parent folder ids
    const folderAncestorIds = ancestors.filter(ancestor => ancestor.objectType === CaHierarchyObjectType.FOLDER).map(ancestor => ancestor.id);

    // mark the ancestor folders as selected and expand them
    for (const node of this.treeControl.dataNodes) {
      node.isSelected = folderAncestorIds.includes(node.id);
      if (node.isSelected) {
        this.treeControl.expand(node);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
