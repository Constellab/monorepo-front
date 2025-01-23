import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaUser } from '../../../../model/entities/ca-user.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CaFolder } from '../../../../model/entities/folder/ca-folder.class';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { ClHelpService } from '@monorepo/core-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaUpdateFolderLeaderDialogInput {
  folderId: string;
  currentLeader: CaUser;
  users$: Observable<CaUser[]>;
}

/**
 * Dialog to update a folder leader
 */
@Component({
  selector: 'ca-update-folder-leader-dialog',
  templateUrl: './ca-update-folder-leader-dialog.component.html',
  styleUrls: ['./ca-update-folder-leader-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FlUserModule,
    MatSelectTrigger,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaUpdateFolderLeaderDialogComponent implements OnInit {
  private input = inject<CaUpdateFolderLeaderDialogInput>(MAT_DIALOG_DATA);
  private folderService = inject(CaFolderService);
  private dialogRef = inject<MatDialogRef<CaUpdateFolderLeaderDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  formControl: FormControl;
  users$: Observable<CaUser[]>;

  isLoading: boolean = false;

  compareWith = ClHelpService.compareFnIds;

  ngOnInit(): void {
    this.users$ = this.input.users$;
    this.formControl = new FormControl<any>(this.input.currentLeader, [Validators.required]);
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.updateFolderLeader(this.formControl.value);
    }
  }

  private updateFolderLeader(newLeader: CaUser): void {
    this.isLoading = true;
    this.folderService.updateFolderLeader(this.input.folderId, newLeader.id).subscribe({
      next: (folder) => this.updateSuccess(folder),
      error: () => (this.isLoading = false),
    });
  }

  private updateSuccess(folder: CaFolder): void {
    this.snackBarService.openSuccessMessage({ text: 'folder_leader_changed', translateText: true });
    this.dialogRef.close(folder);
    this.isLoading = false;
  }
}
