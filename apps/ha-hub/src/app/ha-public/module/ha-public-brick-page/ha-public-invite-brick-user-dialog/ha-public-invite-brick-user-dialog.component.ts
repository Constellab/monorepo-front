import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaBrickUser} from '../../../../ha-core/ha-model/ha-entities/ha-brick-user';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {Validators} from '@angular/forms';

export interface HaInviteBrickUserFormData {
  id?: string;
  email: string;
}

@Component({
  selector: 'ha-public-invite-brick-user-dialog',
  templateUrl: './ha-public-invite-brick-user-dialog.component.html',
  styleUrls: ['./ha-public-invite-brick-user-dialog.component.css']
})
export class HaPublicInviteBrickUserDialogComponent
  extends FlFormDialogAbstractDirective<HaInviteBrickUserFormData, HaBrickUser> implements OnInit{

  brickId: string;
  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaPublicInviteBrickUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: any,
              private brickService: HaBrickService) {
    super(dialogInput, snackBarService, dialogRef);
    this.brickId = dialogInput.object.id;
  }

  ngOnInit(): void {
    this.formGp = this.buildForm();
  }

  buildForm(): FormGroup<HaInviteBrickUserFormData> {
    return new FormBuilder().group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  create(formValue: HaInviteBrickUserFormData): Observable<HaBrickUser> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    throw new Error('Method not implemented.');
  }

  getUpdateSuccessMessage(): string {
    return 'brick_user_invited';
  }

  update(formValue: HaInviteBrickUserFormData): Observable<HaBrickUser> {
    if(this.formGp.valid) {
      return this.brickService.inviteUser(this.brickId, formValue.email);
    }

    return null;
  }

}
