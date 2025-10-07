import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import {
  HaAgentCoAuthorInvite,
  HaBrickCoAuthorInvite,
  HaCoAuthorInvite,
  HaCommunityAppCoAuthorInvite,
  HaStoryCoAuthorInvite,
} from '../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { HaEntityType } from '../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaCurrentPageState } from '../../ha-core/ha-state/ha-current-page.state';

@Component({
  selector: 'ha-invite-page',
  templateUrl: './ha-invite-page.component.html',
  styleUrls: ['./ha-invite-page.component.scss'],
  imports: [HaHeaderComponent, HaFooterComponent, TranslatePipe, FlLoaderModule, MatButton],
})
export class HaInvitePageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private currentPageState = inject(HaCurrentPageState);
  private snackBarService = inject(FlSnackBarService);
  private router = inject(Router);

  private service = this.currentPageState.entityService;

  token: string;

  invite: HaCoAuthorInvite;

  isLoading = false;

  entityTitle: string;

  ngOnInit(): void {
    this.token = this.activeRoute.snapshot.params['token'];
    this.checkValidity();
  }

  acceptInvite(): void {
    this.isLoading = true;
    this.service()
      .acceptInvite(this.token)
      .subscribe({
        next: (entity) => {
          this.router.navigate([this.currentPageState.getEntityPage(entity)]);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  private checkValidity(): void {
    if (!this.token) this.inviteNotValid();

    this.service()
      .isCoAuthorInviteValid(this.token)
      .subscribe({
        next: (invite) => {
          if (!invite) this.inviteNotValid();
          this.invite = invite;

          switch (this.currentPageState.getCurrentEntityType()()) {
            case HaEntityType.STORY:
              this.entityTitle = (invite as HaStoryCoAuthorInvite).story.title;
              break;
            case HaEntityType.APP:
              this.entityTitle = (invite as HaCommunityAppCoAuthorInvite).communityApp.title;
              break;
            case HaEntityType.BRICK:
              this.entityTitle = (invite as HaBrickCoAuthorInvite).brick.name;
              break;
            case HaEntityType.AGENT:
              this.entityTitle = (invite as HaAgentCoAuthorInvite).agent.title;
              break;
            default:
              this.entityTitle = '';
          }
        },
        error: () => {
          this.inviteNotValid();
        },
      });
  }

  private inviteNotValid(): void {
    this.snackBarService.openErrorMessage({ text: 'invalid_invite', translateText: true });

    this.router.navigate(['/']);
  }
}
