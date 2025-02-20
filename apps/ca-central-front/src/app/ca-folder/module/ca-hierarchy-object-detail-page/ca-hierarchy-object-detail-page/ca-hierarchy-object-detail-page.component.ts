import { Component, inject, OnInit } from '@angular/core';
import {
  CaHierarchyObjectDetailState,
} from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { Observable } from 'rxjs';
import {
  CaHierarchyObjectSimple,
  CaHierarchyObjectsTreeDatasource,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { map } from 'rxjs/operators';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FlQueryParamHandler } from '@monorepo/front-core-lib/fl-core';
import {
  CaHierarchyObjectTreeComponent,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-tree/ca-hierarchy-object-tree.component';
import {
  CaHierarchyObjectTagsFilterComponent,
} from '../ca-hierarchy-object-tags-filter/ca-hierarchy-object-tags-filter.component';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CaHierarchyObjectSearchState,
} from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-search.state';

/**
 * Detail page for the folder objects (folder, scenario, note).
 * It contains the breadcrumb and the tree panel that can be open on the left.
 * In center in contains a router outlet to render object page
 */
@Component({
  selector: 'ca-hierarchy-object-detail-page',
  templateUrl: './ca-hierarchy-object-detail-page.component.html',
  styleUrls: ['./ca-hierarchy-object-detail-page.component.scss'],
  // provide the search state at this level to enable search tags
  providers: [CaHierarchyObjectDetailState, CaHierarchyObjectSearchState, FlSearchState, FlQueryParamHandler],
  imports: [
    MatDrawerContainer,
    MatDrawer,
    CaHierarchyObjectTreeComponent,
    MatDrawerContent,
    RouterOutlet,
    AsyncPipe,
    CaHierarchyObjectTagsFilterComponent,
    ReactiveFormsModule,
  ],
})
export class CaHierarchyObjectDetailPageComponent implements OnInit {
  private state = inject(CaHierarchyObjectDetailState);
  private searchState = inject(CaHierarchyObjectSearchState);

  treeOpened$: Observable<boolean>;

  hierarchyObjects: CaHierarchyObjectsTreeDatasource;

  activeObject$: Observable<string>;

  tagFormControl: FormControl;

  getRoute: (node: CaHierarchyObjectSimple) => string = (node: CaHierarchyObjectSimple) => {
    return CaRouterService.getFolderDetailRoute(node.id);
  };

  ngOnInit(): void {
    this.state.init();
    this.searchState.init();

    this.treeOpened$ = this.state.getTreeDrawerOpened$();
    this.hierarchyObjects = this.state.getFolderTree();
    this.activeObject$ = this.state
      .getAncestorsFolders$()
      .pipe(map((ancestors) => this.getActiveFolderId(ancestors)));

    this.tagFormControl = this.searchState.getTagsFormControl();
  }

  private getActiveFolderId(ancestors: CaHierarchyObjectSimple[]): string {
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
