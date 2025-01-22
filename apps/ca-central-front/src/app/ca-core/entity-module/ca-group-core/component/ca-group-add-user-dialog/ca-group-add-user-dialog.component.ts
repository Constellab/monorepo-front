import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaUser } from '../../../../model/entities/ca-user.class';
import { FlSnackBarService, FlUserConfigSearchNameMode } from '@monorepo/front-core-lib';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlDialogModule,
    CdkScrollable,
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

  formControl: FormControl<CaUser>;

  isLoading: boolean = false;

  selectUserMode: FlUserConfigSearchNameMode;

  constructor() {
    const input = this.input;

    this.selectUserMode = input.selectUserMode;
  }

  ngOnInit(): void {
    this.formControl = new FormControl<CaUser>(null, Validators.required);
  }

  get title(): string {
    return this.input.title;
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
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
