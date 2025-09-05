import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  HaAgentDatasourceFilters,
  HaAgentDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import {
  HaAgentCreateDialogComponent,
  HaCreateAgentInput,
} from '../ha-agent-create-dialog/ha-agent-create-dialog.component';
import { HaButtonComponent } from '../../../ha-core/ha-component/ha-button/ha-button.component';
import { HaFooterComponent } from '../../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../../ha-core/ha-component/ha-header/ha-header.component';
import { HaHomeSectionShineComponent } from '../../../ha-home/ha-home-section-shine/ha-home-section-shine.component';
import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';

@Component({
  selector: 'ha-agent-list',
  templateUrl: './ha-agent-list.component.html',
  styleUrls: ['./ha-agent-list.component.scss'],
  imports: [
    FlTextIconModule,
    FlInfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    CoCommunityLibModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    HaDetailRoutePipe,
    HaButtonComponent,
    HaFooterComponent,
    HaHeaderComponent,
    HaHomeSectionShineComponent,
    HaListOfItemsComponent,
  ],
})
export class HaAgentListComponent extends HaCommunityPageDirective implements OnInit {
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
