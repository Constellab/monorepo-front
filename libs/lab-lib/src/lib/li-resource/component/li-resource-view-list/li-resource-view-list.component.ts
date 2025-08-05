import { Component, inject,OnInit } from '@angular/core';
import { ClCoreJsonConvert } from '@monorepo/core-lib';
import { FlArrayObs, FlEntityArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LiResource, LiResourceViewResourcesList } from '@monorepo/lab-lib/li-core';
import { RvResourceViewDirective } from '@monorepo/resource-view';

import { LiResourceDetailState } from '../../state/li-resource-detail.state';
import { LiResourceTableComponent } from '../li-resource-table/li-resource-table.component';

/**
 * View of resource that show a list of other resources
 */
@Component({
  selector: 'li-resource-view-list',
  templateUrl: './li-resource-view-list.component.html',
  styleUrls: ['./li-resource-view-list.component.scss'],
  imports: [LiResourceTableComponent],
})
export class LiResourceViewListComponent
  extends RvResourceViewDirective<LiResourceViewResourcesList>
  implements OnInit
{
  private resourceState = inject(LiResourceDetailState, { optional: true });

  datasource: FlArrayObs<LiResource>;

  columns: FlTableColumnStatic<LiResource>[] = ['name', 'type', 'tags', 'flagged'];

  selectableRow: boolean;

  constructor() {
    super();
  }

  ngOnInit(): void {
    const resources = ClCoreJsonConvert.deserialize(this.view.data, LiResource) as LiResource[];
    this.datasource = new FlEntityArrayObs(resources);

    // if this component is under the ResourceDetailTabsComponent,
    // we don't use link but trigger a resource view load
    // on sub resource click
    this.selectableRow = this.resourceState != null;
  }

  selectResource(resource: LiResource): void {
    if (this.resourceState) {
      this.resourceState.selectResource(resource.id);
    }
  }
}
