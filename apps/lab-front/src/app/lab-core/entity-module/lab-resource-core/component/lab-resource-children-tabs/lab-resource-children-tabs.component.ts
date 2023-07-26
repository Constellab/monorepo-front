import {Component, Signal} from '@angular/core';
import {LabResource} from '../../../../model/entities/resource/lab-resource.entity';
import {LabResourceDetailState} from '../../state/lab-resource-detail.state';

/**
 * Component in the resource detail to show the list of children resources (if ResourceSet)
 * as tabs in the top of the page
 */
@Component({
  selector: 'lab-resource-children-tabs',
  templateUrl: './lab-resource-children-tabs.component.html',
  styleUrls: ['./lab-resource-children-tabs.component.scss'],
})
export class LabResourceChildrenTabsComponent {

  resource: Signal<LabResource> = this.state.mainResource;

  children: Signal<LabResource[]> = this.state.childrenResources;

  selectedResource: Signal<LabResource> = this.state.selectedResource;

  constructor(private state: LabResourceDetailState) {
  }

  selectResource(resource: LabResource): void {
    this.state.selectResource(resource.id);
  }
}
