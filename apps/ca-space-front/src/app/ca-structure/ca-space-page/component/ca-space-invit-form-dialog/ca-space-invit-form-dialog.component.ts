import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { CaSpaceType } from '../../../../ca-core/model/entities/space/ca-space.class';
import {
  CaSpaceInvit,
  CaSpaceInvitCreateDTO,
} from '../../../../ca-core/model/entities/space/ca-space-invit.class';
import { CaSpaceRole } from '../../../../ca-core/model/entities/space/ca-space-user.class';
import { CaSpaceInvitService } from '../../../../ca-core/service-api/ca-space-invit.service';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatSelectTrigger,
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
