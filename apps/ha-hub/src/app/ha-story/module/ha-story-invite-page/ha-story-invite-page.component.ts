import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaStoryCoAuthorInvite} from '../../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-story-invite-page',
  templateUrl: './ha-story-invite-page.component.html',
  styleUrls: ['./ha-story-invite-page.component.scss']
})
export class HaStoryInvitePageComponent implements OnInit {

  token: string;

  invite: HaStoryCoAuthorInvite;

  isLoading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private storyService: HaStoryService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.token = params.token;
      this.checkValidity();
    });
  }

  checkValidity(): void {
    this.storyService.isCoAuthorInviteValid(this.token).subscribe(invite => {
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
