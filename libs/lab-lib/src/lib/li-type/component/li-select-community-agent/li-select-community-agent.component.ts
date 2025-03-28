import { AsyncPipe } from '@angular/common';
import { CoAgent, CoCommunityLibModule } from '@monorepo/community-lib';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LiAgent,
  LiAgentDatasourcePaginated,
  LiCommunitySpace,
  LiProtocolService,
} from '@monorepo/lab-lib/li-core';
import { MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog containing the community agent search to select one
 */
@Component({
  selector: 'li-select-community-agent',
  templateUrl: './li-select-community-agent.component.html',
  styleUrls: ['./li-select-community-agent.component.scss'],
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
export class LiSelectCommunityAgentComponent implements OnInit {
  private protocolService = inject(LiProtocolService);

  @Input() personalOnly: boolean = false;

  //Output event on agent click
  @Output() agentSelected: EventEmitter<LiAgent> = new EventEmitter<LiAgent>();

  agentsDatasource: LiAgentDatasourcePaginated;
  titleFormControl: FormControl<string> = new FormControl('');
  spaceIdFilter: string[] = [];
  spaces: LiCommunitySpace[];

  ngOnInit(): void {
    this.search();
    this.protocolService.getCommunitySpaces().subscribe((spaces) => {
      this.spaces = spaces;
    });
  }

  onAgentClick(agent: LiAgent): void {
    this.agentSelected.emit(agent);
  }

  pythonLabAgentToCoAgent(agent: LiAgent): CoAgent {
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
