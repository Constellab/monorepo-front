import { Component, Input, OnInit } from '@angular/core';
import { CoAgent } from '../../model/co-agent.class';
import { TeRichText } from '@monorepo/text-editor';


@Component({
  selector: 'co-agent-list-item',
  templateUrl: './co-agent-list-item.component.html',
  styleUrls: ['./co-agent-list-item.component.scss']
})
export class CoAgentListItemComponent implements OnInit {
  @Input()
  agent: CoAgent;

  description: string;

  ngOnInit(): void {
    this.description = TeRichText.getFirstParagraphsText(this.agent.description);
  }
}
