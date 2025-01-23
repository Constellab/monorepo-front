import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { HaBrickUser } from '../../../../ha-core/ha-model/ha-entities/ha-brick-user';
import { Observable } from 'rxjs';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface HaInviteBrickUserFormData {
  id?: string;
  email: string;
}

@Component({
  selector: 'ha-public-invite-brick-user-dialog',
  templateUrl: './ha-public-invite-brick-user-dialog.component.html',
  styleUrls: ['./ha-public-invite-brick-user-dialog.component.css'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class HaPublicInviteBrickUserDialogComponent
  extends FlFormDialogAbstractDirective<HaInviteBrickUserFormData, HaBrickUser>
  implements OnInit
{
  private brickService = inject(HaBrickService);

  constructor() {
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
