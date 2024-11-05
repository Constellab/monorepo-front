import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaUser } from '../../../../model/entities/ca-user.class';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { FormControl, Validators } from '@angular/forms';
import { CaFolder } from '../../../../model/entities/folder/ca-folder.class';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { ClHelpService } from '@monorepo/core-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
})
export class CaUpdateFolderLeaderDialogComponent implements OnInit {
  formControl: FormControl;
  users$: Observable<CaUser[]>;

  isLoading: boolean = false;

  compareWith = ClHelpService.compareFnIds;

  constructor(
    @Inject(MAT_DIALOG_DATA) private input: CaUpdateFolderLeaderDialogInput,
    private folderService: CaFolderService,
    private dialogRef: MatDialogRef<CaUpdateFolderLeaderDialogComponent>,
    private snackBarService: FlSnackBarService
  ) {}

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
