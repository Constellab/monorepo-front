import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlUserConfigSearchNameMode, FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaUser } from '../../../../model/entities/ca-user.class';

export interface CaGroupAddUserDialogInput {
  // method to add the user to the group
  addUserToGroup: (userId: string) => Observable<any>;
  title: string;
  successMessage: string;
  selectUserMode?: FlUserConfigSearchNameMode;
}

/**
 * Dialog to add a user to a group or an space
 */
@Component({
  selector: 'ca-group-add-user-dialog',
  templateUrl: './ca-group-add-user-dialog.component.html',
  styleUrls: ['./ca-group-add-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlFormModule,
    FlUserModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaGroupAddUserDialogComponent implements OnInit {
  private input = inject<CaGroupAddUserDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<CaGroupAddUserDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  formControl: FormControl<CaUser | null>;

  isLoading: boolean = false;

  selectUserMode: FlUserConfigSearchNameMode;

  constructor() {
    const input = this.input;

    this.selectUserMode = input.selectUserMode ?? 'space';
  }

  ngOnInit(): void {
    this.formControl = new FormControl<CaUser | null>(null, Validators.required);
  }

  get title(): string {
    return this.input.title;
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading && this.formControl.value != null) {
      this.addUserToSpace(this.formControl.value.id);
    }
  }

  private addUserToSpace(userId: string): void {
    this.isLoading = true;
    this.input.addUserToGroup(userId).subscribe({
      next: (user) => this.addUserSuccess(user),
      error: () => (this.isLoading = false),
    });
  }

  private addUserSuccess(user: any): void {
    this.snackBarService.openSuccessMessage({ text: this.input.successMessage, translateText: true });
    this.isLoading = false;
    this.dialogRef.close(user);
  }
}
