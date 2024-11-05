import { Component, Inject } from '@angular/core';
import { CaSpaceInvitService } from '../../../../ca-core/service-api/ca-space-invit.service';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import {
  CaSpaceInvit,
  CaSpaceInvitCreateDTO,
} from '../../../../ca-core/model/entities/space/ca-space-invit.class';
import { FormBuilder, Validators } from '@angular/forms';
import { CaSpaceType } from '../../../../ca-core/model/entities/space/ca-space.class';
import { CaSpaceRole } from '../../../../ca-core/model/entities/space/ca-space-user.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
})
export class CaSpaceInvitFormDialogComponent {
  formGp = new FormBuilder().group({
    userMail: [null as string, [Validators.required, Validators.email]],
    role: [CaSpaceRole.USER as CaSpaceRole, Validators.required],
  });
  spaceType: CaSpaceType;

  availableRoles = CaSpaceRole;

  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private input: CaSpaceInvitFormDialogInput,
    private dialogRef: MatDialogRef<CaSpaceInvitFormDialogComponent>,
    private spaceInvitService: CaSpaceInvitService,
    private snackBarService: FlSnackBarService
  ) {
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
