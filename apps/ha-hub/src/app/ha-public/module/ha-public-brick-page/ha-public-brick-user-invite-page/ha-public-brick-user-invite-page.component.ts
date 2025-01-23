import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { HaBrickCoAuthorInvite } from '../../../../ha-core/entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-ha-public-brick-user-invite-page',
  templateUrl: './ha-public-brick-user-invite-page.component.html',
  styleUrls: ['./ha-public-brick-user-invite-page.component.scss'],
  imports: [MatButton, FlLoaderModule, TranslatePipe],
})
export class HaPublicBrickUserInvitePageComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private brickService = inject(HaBrickService);
  private router = inject(Router);

  token: string;

  invite: HaBrickCoAuthorInvite;

  isLoading = false;

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.token = params.token;
      this.checkValidity();
    });
  }

  checkValidity(): void {
    this.brickService.isCoAuthorInviteValid(this.token).subscribe((invite) => {
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
