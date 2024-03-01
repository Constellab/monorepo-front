import {Component, Input} from '@angular/core';

export interface PrWorkflowNodeIcon{
  icon?: string;
  iconTooltip?: string;
  iconColor?: string;
  img?: string;
}

@Component({
  selector: 'pr-workflow-node-content',
  templateUrl: './pr-workflow-node-content.component.html',
  styleUrl: './pr-workflow-node-content.component.scss'
})
export class PrWorkflowNodeContentComponent {

  @Input() icon: PrWorkflowNodeIcon;
}
