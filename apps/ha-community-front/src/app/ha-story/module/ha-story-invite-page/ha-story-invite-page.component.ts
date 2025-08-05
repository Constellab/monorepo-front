import { Component, inject,OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { HaStoryCoAuthorInvite } from '../../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';

@Component({
  selector: 'ha-story-invite-page',
  templateUrl: './ha-story-invite-page.component.html',
  styleUrls: ['./ha-story-invite-page.component.scss'],
  imports: [MatButton, FlLoaderModule, TranslatePipe],
})
export class HaStoryInvitePageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private storyService = inject(HaStoryService);
  private router = inject(Router);

  token: string;

  invite: HaStoryCoAuthorInvite;

  isLoading = false;

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.token = params.token;
      this.checkValidity();
    });
  }

  checkValidity(): void {
    this.storyService.isCoAuthorInviteValid(this.token).subscribe((invite) => {
      this.invite = invite;
      if (!invite) {
        this.router.navigate(['/']);
      }
    });
  }

  acceptInvite(): void {
    this.isLoading = true;
    this.storyService.acceptInvite(this.token).subscribe((story) => {
      this.router.navigate([HaRouterService.getStoryEditRoute(story.id)]);
      this.isLoading = false;
    });
  }
}
