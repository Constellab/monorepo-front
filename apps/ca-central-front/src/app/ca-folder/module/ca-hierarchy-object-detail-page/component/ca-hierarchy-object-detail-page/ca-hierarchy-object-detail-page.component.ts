import { Component, OnInit } from '@angular/core';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { Observable } from 'rxjs';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
  CaHierarchyObjectWithChildren
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { map } from 'rxjs/operators';

/**
 * Detail page for the folder objects (folder, experiment, report).
 * It contains the breadcrumb and the tree panel that can be open on the left.
 * In center in contains a router outlet to render object page
 */
@Component({
  selector: 'ca-hierarchy-object-detail-page',
  templateUrl: './ca-hierarchy-object-detail-page.component.html',
  styleUrls: ['./ca-hierarchy-object-detail-page.component.scss'],
  providers: [CaHierarchyObjectDetailState]
})
export class CaHierarchyObjectDetailPageComponent implements OnInit {

  treeOpened$: Observable<boolean>;

  hierarchyObjects$: Observable<CaHierarchyObjectWithChildren[]>;

  activeObject$: Observable<string>;

  getRoute: (node: CaHierarchyObject) => string = (node: CaHierarchyObject) => {
    return CaRouterService.getFolderDetailRoute(node.id);
  };

  constructor(private state: CaHierarchyObjectDetailState) {
  }

  ngOnInit(): void {
    this.state.init();

    this.treeOpened$ = this.state.getTreeDrawerOpened$();
    this.hierarchyObjects$ = this.state.getFolderTree$().pipe(
      map(tree => tree.children)
    );

    this.activeObject$ = this.state.getAncestorsFolders$().pipe(
      map(ancestors => this.getActiveFolderId(ancestors))
    );
  }

  private getActiveFolderId(ancestors: CaHierarchyObject[]): string {
    const lastAncestor = ancestors[0];

    if (!lastAncestor) return null;

    if (lastAncestor.objectType === CaHierarchyObjectType.FOLDER) {
      return lastAncestor.id;
    } else {
      // if this is not a folder, we return the parent folder
      return lastAncestor.parentId;
    }
  }

}
