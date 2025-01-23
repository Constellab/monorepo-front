import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { HaBrickUser } from '../../../../ha-core/ha-model/ha-entities/ha-brick-user';
import { Observable } from 'rxjs';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
    CdkScrollable,
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
