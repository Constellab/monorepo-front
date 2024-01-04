import {Component, Input, OnInit} from '@angular/core';
import {HaBrick} from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {HaBrickUser} from '../../../../ha-core/ha-model/ha-entities/ha-brick-user';
import {FlConfirmDialogInput, FlDialogService} from '@monorepo/front-core-lib';
import {
  HaPublicInviteBrickUserDialogComponent
} from '../ha-public-invite-brick-user-dialog/ha-public-invite-brick-user-dialog.component';

@Component({
  selector: 'ha-public-brick-users',
  templateUrl: './ha-public-brick-users.component.html',
  styleUrls: ['./ha-public-brick-users.component.scss'],
})
export class HaPublicBrickUsersComponent implements OnInit {

  @Input() brick: HaBrick;

  brickUsers: HaBrickUser[]

  constructor(private brickService: HaBrickService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.brickService.getBrickUsers(this.brick.id).subscribe(brickUsers => {
      this.brickUsers = brickUsers;
    });
  }

  openAddUserToBrickDialog(): void {
    const input = {
      mode: 'update',
      object: this.brick
    }

    this.dialogService.openSmallDialog(HaPublicInviteBrickUserDialogComponent, {data: input}).afterClosed().subscribe(() =>{});
  }

  removeBrickUser(brickUser: HaBrickUser): void {
    const input: FlConfirmDialogInput = {
      title: 'remove_user_confirmation',
      content: 'remove_user_confirmation_message',
      translateTitleAndContent: true,
      successMessage: 'user_removed',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(result => {
      if (result.choice) {
        this.brickService.removeBrickUser(brickUser).subscribe(() => {
          this.brickUsers = this.brickUsers.filter(bu => bu.id !== brickUser.id);
        });
      }
    })

  }
}
