import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlFlatTreeControl } from '@monorepo/front-core-lib';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CaProjectObjectDetailState } from '../../../ca-project-object-core/state/ca-project-object-detail.state';
import {
  CaFolder,
  CaFolderObjectType,
  CaFolderWithChildren
} from '../../../../../ca-core/model/entities/project/ca-folder.class';

interface CaProjectFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  isSelected: boolean;
  objectType: CaFolderObjectType;
}

/**
 * Display the tree from the root project of an object
 */
@Component({
  selector: 'ca-project-object-tree',
  templateUrl: './ca-project-object-tree.component.html',
  styleUrls: ['./ca-project-object-tree.component.scss']
})
export class CaProjectObjectTreeComponent implements OnInit, OnDestroy {

  rootProject: CaFolderWithChildren;
  treeControl: FlFlatTreeControl<CaProjectFlatNode, string>;
  dataSource: MatTreeFlatDataSource<CaFolderWithChildren, CaProjectFlatNode>;

  isLoading: boolean = false;

  // use as saved for backup
  private currentAncestors: CaFolder[];
  private subscription: Subscription;

  private _transformer = (node: CaFolderWithChildren, level: number): CaProjectFlatNode => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      level: level,
      name: node.name,
      isSelected: false,
      objectType: node.objectType
    };
  };

  hasChild = (_: number, node: CaProjectFlatNode): boolean => node.expandable;


  constructor(private state: CaProjectObjectDetailState) {
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.state.getProjectTree$().pipe(
      // as the tree start with the root, it only needs to be loaded once
    ).subscribe({
      next: projectTree => this.constructTree(projectTree),
      error: () => this.isLoading = false
    });


    this.subscription = this.state.getProjectAncestors$().subscribe(
      ancestors => this.onAncestorChange(ancestors)
    );
  }


  private constructTree(projectTree: CaFolderWithChildren): void {
    this.rootProject = projectTree;
    this.treeControl = new FlFlatTreeControl<CaProjectFlatNode, string>(
      node => node.level, node => node.expandable, {
        trackBy: node => node.id
      });

    // object to flatten tree
    const treeFlattener: MatTreeFlattener<CaFolderWithChildren, CaProjectFlatNode, string> = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable,
      node => node.children);

    // create the datasource and set data
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener, projectTree.children);

    this.isLoading = false;

    // if the ancestors were already loaded, we need to update the tree
    if (this.currentAncestors != null) {
      this.onAncestorChange(this.currentAncestors);
    }

  }

  private onAncestorChange(ancestors: CaFolder[]): void {
    this.currentAncestors = ancestors;
    if (this.treeControl == null) return;

    // retrieve the parent project ids
    const projectAncestorIds = ancestors.filter(ancestor => ancestor.objectType === CaFolderObjectType.FOLDER).map(ancestor => ancestor.id);

    // mark the ancestor projects as selected and expand them
    for (const node of this.treeControl.dataNodes) {
      node.isSelected = projectAncestorIds.includes(node.id);
      if (node.isSelected) {
        this.treeControl.expand(node);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
