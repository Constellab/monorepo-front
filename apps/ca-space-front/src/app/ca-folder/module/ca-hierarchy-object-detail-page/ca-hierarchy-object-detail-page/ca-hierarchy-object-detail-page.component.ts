import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { FlQueryParamHandler } from '@monorepo/front-core-lib/fl-core';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaHierarchyObjectTreeComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-tree/ca-hierarchy-object-tree.component';
import {
  CaHierarchyObjectSimple,
  CaHierarchyObjectsTreeDatasource,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaFolderRightPanelState } from '../../ca-folder-detail-page/state/ca-folder-right-panel.state';
import { CaHierarchyObjectActionsMenuState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-actions-menu.state';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObjectEventState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import { CaHierarchyObjectSearchState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-search.state';
import { CaHierarchyObjectTagsFilterComponent } from '../ca-hierarchy-object-tags-filter/ca-hierarchy-object-tags-filter.component';

/**
 * Detail page for the folder objects (folder, scenario, note).
 * It contains the breadcrumb and the tree panel that can be open on the left.
 * In center in contains a router outlet to render object page
 */
@Component({
  selector: 'ca-hierarchy-object-detail-page',
  templateUrl: './ca-hierarchy-object-detail-page.component.html',
  styleUrls: ['./ca-hierarchy-object-detail-page.component.scss'],
  providers: [
    CaHierarchyObjectEventState,
    CaHierarchyObjectDetailState,
    CaHierarchyObjectSearchState,
    CaHierarchyObjectActionsMenuState,
    CaFolderRightPanelState,
    // provide the search state at this level to enable search tags
    FlSearchState,
    FlQueryParamHandler,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
