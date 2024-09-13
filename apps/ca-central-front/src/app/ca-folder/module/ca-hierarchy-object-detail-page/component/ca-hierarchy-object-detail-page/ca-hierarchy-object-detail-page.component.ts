import {Component, OnInit} from '@angular/core';
import {CaHierarchyObjectDetailState} from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import {Observable} from 'rxjs';

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

  constructor(private state: CaHierarchyObjectDetailState) {
  }

  ngOnInit(): void {
    this.state.init();

    this.treeOpened$ = this.state.getTreeDrawerOpened$();
  }

}
