import { Component, inject } from '@angular/core';
import { CaSpaceInvitService } from '../../../../ca-core/service-api/ca-space-invit.service';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  CaSpaceInvit,
  CaSpaceInvitCreateDTO,
} from '../../../../ca-core/model/entities/space/ca-space-invit.class';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CaSpaceType } from '../../../../ca-core/model/entities/space/ca-space.class';
import { CaSpaceRole } from '../../../../ca-core/model/entities/space/ca-space-user.class';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaSpaceInvitFormDialogInput {
  spaceId: string;
  spaceType: CaSpaceType;
}

/**
 * Dialog to create a space invitation
 */
@Component({
  selector: 'ca-space-invit-form-dialog',
  templateUrl: './ca-space-invit-form-dialog.component.html',
  styleUrls: ['./ca-space-invit-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatIcon,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaSpaceInvitFormDialogComponent {
  private input = inject<CaSpaceInvitFormDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<CaSpaceInvitFormDialogComponent>>(MatDialogRef);
  private spaceInvitService = inject(CaSpaceInvitService);
  private snackBarService = inject(FlSnackBarService);

  formGp = new FormBuilder().group({
    userMail: [null as string, [Validators.required, Validators.email]],
    role: [CaSpaceRole.USER as CaSpaceRole, Validators.required],
  });
  spaceType: CaSpaceType;

  availableRoles = CaSpaceRole;

  isLoading: boolean = false;

  constructor() {
    const input = this.input;

    this.spaceType = input.spaceType;
  }

  submit(): void {
    if (this.formGp.valid && !this.isLoading) {
      this.createInvitation(this.formGp.getRawValue());
    }
  }

  private createInvitation(invitationDto: CaSpaceInvitCreateDTO): void {
    this.isLoading = true;
    this.spaceInvitService.createInvitation(this.input.spaceId, invitationDto).subscribe({
      next: (invitation) => this.createSuccess(invitation),
      error: () => (this.isLoading = false),
    });
  }

  private createSuccess(invitation: CaSpaceInvit): void {
    this.snackBarService.openSuccessMessage({ text: 'invitation_created', translateText: true });
    this.dialogRef.close(invitation);
    this.isLoading = false;
  }
}
