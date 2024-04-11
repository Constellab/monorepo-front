import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  HaLiveTaskCoAuthorInvite
} from '../../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ClStringHelper} from '@monorepo/core-lib';

@Component({
  selector: 'ha-live-task-invite-page',
  templateUrl: './ha-live-task-invite-page.component.html',
  styleUrls: ['./ha-live-task-invite-page.component.scss']
})
export class HaLiveTaskInvitePageComponent implements OnInit {

  token: string;

  invite: HaLiveTaskCoAuthorInvite;

  isLoading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private liveTaskService: HaLiveTaskService,
    private router: Router) {
  }

  ngOnInit(): void {
    console.log('OUIIIIIIIIII')
    this.activeRoute.params.subscribe(params => {
      this.token = params.token;
      this.checkValidity();
    });
  }

  checkValidity(): void {
    this.liveTaskService.isCoAuthorInviteValid(this.token).subscribe(invite => {
      this.invite = invite;
      if (!invite) {
        this.router.navigate(['/']);
      }
    });
  }

  acceptInvite(): void {
    this.isLoading = true;
    this.liveTaskService.acceptInvite(this.token).subscribe((liveTask) => {
      this.router.navigate(['/live-tasks/', liveTask.id, ClStringHelper.getCleanUrlPath(liveTask.title)]);
      this.isLoading = false;
    });
  }

}
