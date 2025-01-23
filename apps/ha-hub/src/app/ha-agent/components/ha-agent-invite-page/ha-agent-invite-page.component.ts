import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HaAgentCoAuthorInvite } from '../../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-agent-invite-page',
  templateUrl: './ha-agent-invite-page.component.html',
  styleUrls: ['./ha-agent-invite-page.component.scss'],
  imports: [MatButton, FlLoaderModule, TranslatePipe],
})
export class HaAgentInvitePageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private agentService = inject(HaAgentService);
  private router = inject(Router);

  token: string;

  invite: HaAgentCoAuthorInvite;

  isLoading = false;

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.token = params.token;
      this.checkValidity();
    });
  }

  checkValidity(): void {
    this.agentService.isCoAuthorInviteValid(this.token).subscribe((invite) => {
      this.invite = invite;
      if (!invite) {
        this.router.navigate(['/']);
      }
    });
  }

  acceptInvite(): void {
    this.isLoading = true;
    this.agentService.acceptInvite(this.token).subscribe((agent) => {
      this.router.navigate([
        HaRouterService.getAgentRoute(agent.id, ClStringHelper.getCleanUrlPath(agent.title)),
      ]);
      this.isLoading = false;
    });
  }
}
