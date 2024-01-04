import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {HaBrickUserInvite} from '../../../../ha-core/ha-model/ha-entities/ha-brick-user-invite.class';

@Component({
  selector: 'ha-ha-public-brick-user-invite-page',
  templateUrl: './ha-public-brick-user-invite-page.component.html',
  styleUrls: ['./ha-public-brick-user-invite-page.component.scss']
})
export class HaPublicBrickUserInvitePageComponent implements OnInit {

  token: string;

  invite: HaBrickUserInvite;

  isLoading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private brickService: HaBrickService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.token = params.token;
      this.checkValidity();
    });
  }

  checkValidity(): void {
    this.brickService.isBrickUserInviteValid(this.token).subscribe(invite => {
      this.invite = invite;
      if (!invite) {
        this.router.navigate(['/']);
      }
    });
  }

  acceptInvite(): void {
    this.isLoading = true;
    this.brickService.acceptInvite(this.token).subscribe((brick) => {
      this.router.navigate(['/bricks', brick.name, 'latest']);
      this.isLoading = false;
    });
  }

}
