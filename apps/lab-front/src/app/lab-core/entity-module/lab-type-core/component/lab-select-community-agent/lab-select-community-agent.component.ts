import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { LabAgent, LabAgentDatasourcePaginated } from '../../../../model/entities/lab-agent.entity';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabCommunitySpace } from '../../../../model/entities/lab-community-space.entity';
import { CoAgent } from '@monorepo/community-lib';
import { MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog containing the community agent search to select one
 */
@Component({
  selector: 'lab-select-community-agent',
  templateUrl: './lab-select-community-agent.component.html',
  styleUrls: ['./lab-select-community-agent.component.scss'],
  imports: [
    MatChipOption,
    MatDivider,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatIcon,
    FlInfiniteScrollModule,
    CoCommunityLibModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabSelectCommunityAgentComponent implements OnInit {
  private protocolService = inject(LabProtocolService);

  @Input() personalOnly: boolean = false;

  //Output event on agent click
  @Output() agentSelected: EventEmitter<LabAgent> = new EventEmitter<LabAgent>();

  agentsDatasource: LabAgentDatasourcePaginated;
  titleFormControl: FormControl<string> = new FormControl('');
  spaceIdFilter: string[] = [];
  spaces: LabCommunitySpace[];

  ngOnInit(): void {
    this.search();
    this.protocolService.getCommunitySpaces().subscribe((spaces) => {
      this.spaces = spaces;
    });
  }

  onAgentClick(agent: LabAgent): void {
    this.agentSelected.emit(agent);
  }

  pythonLabAgentToCoAgent(agent: LabAgent): CoAgent {
    return agent.toCoAgent();
  }

  search(): void {
    this.agentsDatasource = this.protocolService.getCommunityAvailableAgentsWithFiltersPaginated(
      this.spaceIdFilter,
      this.titleFormControl.value,
      this.personalOnly
    );
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
