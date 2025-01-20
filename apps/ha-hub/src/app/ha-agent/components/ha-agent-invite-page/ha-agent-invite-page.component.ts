import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HaAgentCoAuthorInvite } from '../../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
    selector: 'ha-agent-invite-page',
    templateUrl: './ha-agent-invite-page.component.html',
    styleUrls: ['./ha-agent-invite-page.component.scss'],
    standalone: false
})
export class HaAgentInvitePageComponent implements OnInit {
  token: string;

  invite: HaAgentCoAuthorInvite;

  isLoading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private agentService: HaAgentService,
    private router: Router
  ) {}

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
