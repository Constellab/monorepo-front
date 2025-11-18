import { Component, Input } from '@angular/core';

import { CoAgent } from '../../model/co-agent.class';
import { CoListItemType } from '../../model/co-list-item-type.enum';

@Component({
  selector: 'co-agent-list-item',
  templateUrl: './co-agent-list-item.component.html',
  styleUrls: ['./co-agent-list-item.component.scss'],
  standalone: false,
})
export class CoAgentListItemComponent {
  @Input()
  agent: CoAgent;

  type = CoListItemType.AGENT;
}
