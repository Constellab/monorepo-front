import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput,
} from '../../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaUser } from '../../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-public-brick-users',
  templateUrl: './ha-public-brick-users.component.html',
  styleUrls: ['./ha-public-brick-users.component.scss'],
  imports: [MatIconButton, MatTooltip, MatIcon, RouterLink, FlUserModule, TranslatePipe, AsyncPipe],
})
export class HaPublicBrickUsersComponent implements OnInit {
  private brickService = inject(HaBrickService);
  private dialogService = inject(FlDialogService);
  private authUserService = inject(HaAuthenticatedUserService);

  @Input() brick: HaBrick;

  isCreator$: Observable<boolean>;

  profileRoute = HaRouterService.getProfileRoute();

  brickUsers: HaUser[];

  ngOnInit(): void {
    this.brickService.getCoAuthors(this.brick.id).subscribe((brickUsers) => {
      this.brickUsers = brickUsers;
    });
    this.isCreator$ = this.authUserService.isBrickCreator(this.brick);
  }

  openAddUserToBrickDialog(): void {
    const input: HaCoAuthorsDialogInput = {
      id: this.brick.id,
      service: this.brickService,
      inviteText: 'invite_brick_coauthor_information',
    };

    this.dialogService
      .openSmallDialog(HaCoAuthorDialogComponent, { data: input })
      .afterClosed()
      .subscribe(() => {});
  }
}
