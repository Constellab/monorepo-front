import {Component, OnInit} from '@angular/core';
import {HaAgentService} from '../../../ha-core/ha-service/ha-agent.service';
import {FlDialogService} from '@monorepo/front-core-lib';
import {Router} from '@angular/router';
import {
  HaCreateAgentInput,
  HaAgentCreateDialogComponent
} from '../ha-agent-create-dialog/ha-agent-create-dialog.component';
import {HaAgentVersion} from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaAgentDatasourcePaginated} from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import {FormControl} from '@angular/forms';
import {ClStringHelper} from "@monorepo/core-lib";
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-agent-list',
  templateUrl: './ha-agent-list.component.html',
  styleUrls: ['./ha-agent-list.component.scss']
})
export class HaAgentListComponent implements OnInit {

  agentsPaginated: HaAgentDatasourcePaginated;
  user: HaUser;
  spaceIdFilter: string[] = [];
  titleFormControl: FormControl<string> = new FormControl('');

  constructor(
    private agentService: HaAgentService,
    private dialogService: FlDialogService,
    private router: Router,
    private authenticatedUserService: HaAuthenticatedUserService) {
  }

  ngOnInit(): void {

    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.user = user;
    });
    this.agentsPaginated = this.agentService.getAllWithFiltersPaginated();
    this.updateAgents();
  }



  openCreateAgentDialog(): void {
    const input: HaCreateAgentInput = {
      mode: 'create'
    }

    this.dialogService.openSmallDialog(HaAgentCreateDialogComponent, {data: input}).afterClosed()
      .subscribe((agentVersion: HaAgentVersion) => {
        if (agentVersion && agentVersion.agent) {
          this.router.navigate([HaRouterService.getAgentVersionRoute(agentVersion)]);
        }
      });
  }

  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if(this.isSelected(spaceId)){
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }
    this.updateAgents();
  }

  onSpace(spaceId: string): void{
    this.selectSpace(spaceId)
  }

  search(event: any): void {
    event.preventDefault();
    this.updateAgents();
  }

  updateAgents(): void {
    this.agentsPaginated.getFirstPage({
      spacesFilter: this.spaceIdFilter,
      titleFilter: this.titleFormControl.value
    });
  }

  protected readonly ClStringHelper = ClStringHelper;
}
