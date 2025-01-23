import { Component, inject, OnInit } from '@angular/core';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { Router, RouterLink } from '@angular/router';
import {
  HaAgentCreateDialogComponent,
  HaCreateAgentInput,
} from '../ha-agent-create-dialog/ha-agent-create-dialog.component';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {
  HaAgentDatasourceFilters,
  HaAgentDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaCommunityPage } from '../../../ha-core/utils/ha-community.page';
import { HaIsAuthenticatedDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-authenticated/ha-is-authenticated.directive';
import { MatIcon } from '@angular/material/icon';
import { HaSidenavButtonDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChipOption } from '@angular/material/chips';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { HaSelectableSpaceListComponent } from '../../../ha-space/module/ha-selectable-space-list/ha-selectable-space-list.component';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';

@Component({
  selector: 'ha-agent-list',
  templateUrl: './ha-agent-list.component.html',
  styleUrls: ['./ha-agent-list.component.scss'],
  imports: [
    HaIsAuthenticatedDirective,
    MatIcon,
    HaSidenavButtonDirective,
    MatButton,
    MatChipOption,
    FlTextIconModule,
    HaSelectableSpaceListComponent,
    FlInfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatTooltip,
    RouterLink,
    CoCommunityLibModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    HaDetailRoutePipe,
  ],
})
export class HaAgentListComponent extends HaCommunityPage implements OnInit {
  private agentService: HaAgentService = inject(HaAgentService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private router: Router = inject(Router);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  agentsPaginated: HaAgentDatasourcePaginated<HaAgentDatasourceFilters>;
  user: HaUser;
  spaceIdFilter: string[] = [];
  titleFormControl: FormControl<string> = new FormControl('');

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.user = user;
    });
    this.agentsPaginated = this.agentService.getAllWithFiltersPaginated();
    this.updateAgents();
    super.setMetaTags(
      'ha.agents.title',
      'ha.agents.description',
      null,
      HaRouterService.getFullRoute(HaRouterService.getAgentsListRoute())
    );
  }

  openCreateAgentDialog(): void {
    const input: HaCreateAgentInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(HaAgentCreateDialogComponent, { data: input })
      .afterClosed()
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
    if (this.isSelected(spaceId)) {
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }
    this.updateAgents();
  }

  onSpace(spaceId: string): void {
    this.selectSpace(spaceId);
  }

  search(event: any): void {
    event.preventDefault();
    this.updateAgents();
  }

  updateAgents(): void {
    this.agentsPaginated.getFirstPage({
      spacesFilter: this.spaceIdFilter,
      titleFilter: this.titleFormControl.value,
    });
  }

  protected readonly ClStringHelper = ClStringHelper;
}
