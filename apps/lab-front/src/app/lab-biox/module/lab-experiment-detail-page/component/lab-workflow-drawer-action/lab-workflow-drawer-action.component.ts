import {Component, Signal} from '@angular/core';
import {LabWorkflowNodeDetailState} from '../../state/lab-workflow-node-detail.state';
import {LabProcess} from '../../../../../lab-core/model/entities/process/lab-process.entity';

/**
 * This component is the content of the drawer,
 * the content is adapted based on user action
 */
@Component({
  selector: 'lab-workflow-drawer-action',
  templateUrl: './lab-workflow-drawer-action.component.html',
  styleUrls: ['./lab-workflow-drawer-action.component.scss']
})
export class LabWorkflowDrawerActionComponent {

  process: Signal<LabProcess> = this.nodeDetailState.process2;

  constructor(private nodeDetailState: LabWorkflowNodeDetailState) {
  }


}
