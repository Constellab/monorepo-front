import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { HaCommunityAppCoAuthorInvite } from '../../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-community-app-invite-page',
  templateUrl: './ha-community-app-invite-page.component.html',
  styleUrls: ['./ha-community-app-invite-page.component.scss'],
  imports: [MatButton, FlLoaderModule, TranslatePipe],
})
export class HaCommunityAppInvitePageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private communityAppService = inject(HaCommunityAppService);
  private router = inject(Router);

  token: string;

  invite: HaCommunityAppCoAuthorInvite;

  isLoading = false;

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.token = params.token;
      this.checkValidity();
    });
  }

  checkValidity(): void {
    this.communityAppService.isCoAuthorInviteValid(this.token).subscribe((invite) => {
      this.invite = invite;
      if (!invite) {
        this.router.navigate(['/']);
      }
    });
  }

  acceptInvite(): void {
    this.isLoading = true;
    this.communityAppService.acceptInvite(this.token).subscribe((communityApp) => {
      this.router.navigate([
        HaRouterService.getCommunityAppRoute(
          communityApp.id,
          ClStringHelper.getCleanUrlPath(communityApp.title)
        ),
      ]);
      this.isLoading = false;
    });
  }
}
