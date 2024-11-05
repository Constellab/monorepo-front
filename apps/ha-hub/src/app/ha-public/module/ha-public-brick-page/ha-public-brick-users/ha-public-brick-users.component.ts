import { Component, Input, OnInit } from '@angular/core';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput,
} from '../../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { HaUser } from '../../../../ha-core/ha-model/ha-entities/ha-user';
import { Observable } from 'rxjs';
import { HaAuthenticatedUserService } from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-public-brick-users',
  templateUrl: './ha-public-brick-users.component.html',
  styleUrls: ['./ha-public-brick-users.component.scss'],
})
export class HaPublicBrickUsersComponent implements OnInit {
  @Input() brick: HaBrick;

  isCreator$: Observable<boolean>;

  profileRoute = HaRouterService.getProfileRoute();

  brickUsers: HaUser[];

  constructor(
    private brickService: HaBrickService,
    private dialogService: FlDialogService,
    private authUserService: HaAuthenticatedUserService
  ) {}

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
