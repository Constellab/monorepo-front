import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabAgent, LabAgentDatasourcePaginated } from '../../../../model/entities/lab-agent.entity';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { FormControl } from '@angular/forms';
import { LabCommunitySpace } from '../../../../model/entities/lab-community-space.entity';
import { CoAgent } from '@monorepo/community-lib';

/**
 * Dialog containing the community agent search to select one
 */
@Component({
  selector: 'lab-select-community-agent',
  templateUrl: './lab-select-community-agent.component.html',
  styleUrls: ['./lab-select-community-agent.component.scss']
})
export class LabSelectCommunityAgentComponent implements OnInit {

  @Input() personalOnly: boolean = false;

  //Output event on agent click
  @Output() agentSelected: EventEmitter<LabAgent> = new EventEmitter<LabAgent>();


  agentsDatasource: LabAgentDatasourcePaginated;
  titleFormControl: FormControl<string> = new FormControl('');
  spaceIdFilter: string[] = [];
  spaces: LabCommunitySpace[];

  constructor(private protocolService: LabProtocolService) {
  }

  ngOnInit(): void {
    this.search();
    this.protocolService.getCommunitySpaces().subscribe(spaces => {
      this.spaces = spaces
    });
  }

  onAgentClick(agent: LabAgent): void {
    this.agentSelected.emit(agent);
  }


  pythonLabAgentToCoAgent(agent: LabAgent): CoAgent {
    return agent.toCoAgent();
  }

  search(): void {
    this.agentsDatasource =
      this.protocolService.getCommunityAvailableAgentsWithFiltersPaginated(
        this.spaceIdFilter, this.titleFormControl.value, this.personalOnly);
  }

  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if (this.isSelected(spaceId)) {
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }

    this.search();
  }
}
