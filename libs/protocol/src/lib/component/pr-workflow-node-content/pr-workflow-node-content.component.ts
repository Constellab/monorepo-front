import { Component, Input } from '@angular/core';
import { TdTypeStyleIconType } from '@monorepo/technical-doc';

export interface PrWorkflowNodeIcon {
  icon: string;
  iconType: TdTypeStyleIconType;
  iconTooltip?: string;
  iconColor?: string;
}

@Component({
  selector: 'pr-workflow-node-content',
  templateUrl: './pr-workflow-node-content.component.html',
  styleUrl: './pr-workflow-node-content.component.scss',
})
export class PrWorkflowNodeContentComponent {
  @Input({ required: true }) icon: PrWorkflowNodeIcon;
}
