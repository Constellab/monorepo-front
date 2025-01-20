import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { HaBrickUser } from '../../../../ha-core/ha-model/ha-entities/ha-brick-user';
import { Observable } from 'rxjs';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

export interface HaInviteBrickUserFormData {
  id?: string;
  email: string;
}

@Component({
    selector: 'ha-public-invite-brick-user-dialog',
    templateUrl: './ha-public-invite-brick-user-dialog.component.html',
    styleUrls: ['./ha-public-invite-brick-user-dialog.component.css'],
    standalone: false
})
export class HaPublicInviteBrickUserDialogComponent
  extends FlFormDialogAbstractDirective<HaInviteBrickUserFormData, HaBrickUser>
  implements OnInit
{
  constructor(private brickService: HaBrickService) {
    super();
  }

  ngOnInit(): void {
    this.formGp = this.buildForm();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  create(): Observable<HaBrickUser> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    throw new Error('Method not implemented.');
  }

  getUpdateSuccessMessage(): string {
    return 'brick_user_invited';
  }

  update(formValue: HaInviteBrickUserFormData): Observable<HaBrickUser> {
    if (this.formGp.valid) {
      return this.brickService.inviteUser(this.dialogInput.object.id, formValue.email);
    }

    return null;
  }
}
