import { Component, OnInit, Optional } from '@angular/core';
import { LabResourceViewResourcesList } from '../../../../model/entities/resource/lab-resource-view.entity';
import { FlArrayObs, FlEntityArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { ClCoreJsonConvert } from '@monorepo/core-lib';
import { RvResourceViewDirective } from '@monorepo/resource-view';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';

/**
 * View of resource that show a list of other resources
 */
@Component({
    selector: 'lab-resource-view-list',
    templateUrl: './lab-resource-view-list.component.html',
    styleUrls: ['./lab-resource-view-list.component.scss'],
    standalone: false
})
export class LabResourceViewListComponent
  extends RvResourceViewDirective<LabResourceViewResourcesList>
  implements OnInit
{
  datasource: FlArrayObs<LabResource>;

  columns: FlTableColumnStatic<LabResource>[] = ['name', 'type', 'tags', 'flagged'];

  selectableRow: boolean;

  constructor(@Optional() private resourceState: LabResourceDetailState) {
    super();
  }

  ngOnInit(): void {
    const resources = ClCoreJsonConvert.deserialize(this.view.data, LabResource) as LabResource[];
    this.datasource = new FlEntityArrayObs(resources);

    // if this component is under the ResourceDetailTabsComponent,
    // we don't use link but trigger a resource view load
    // on sub resource click
    this.selectableRow = this.resourceState != null;
  }

  selectResource(resource: LabResource): void {
    if (this.resourceState) {
      this.resourceState.selectResource(resource.id);
    }
  }
}
