import { Component, Input } from '@angular/core';
import { CoAgent } from '../../model/co-agent.class';

@Component({
  selector: 'co-agent-list-item',
  templateUrl: './co-agent-list-item.component.html',
  styleUrls: ['./co-agent-list-item.component.scss'],
  standalone: false,
})
export class CoAgentListItemComponent {
  @Input()
  agent: CoAgent;

  description: string;
}
