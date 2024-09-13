import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FlSnackBarService} from '@monorepo/front-core-lib';
import {
  CaFolderNotifOptions,
  CaFolderUserConfig
} from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import {FormBuilder, Validators} from '@angular/forms';
import {CaFolderService} from '../../../../../ca-core/service-api/ca-folder.service';

export interface CaFolderUserConfigDialogInput {
  folderId: string;
}

/**
 * Dialog for a user to update its configuration for a folder
 * For now this only contains the notification options
 */
@Component({
  selector: 'ca-folder-user-config-dialog',
  templateUrl: './ca-folder-user-config-dialog.component.html',
  styleUrls: ['./ca-folder-user-config-dialog.component.scss']
})
export class CaFolderUserConfigDialogComponent implements OnInit {

  userConfig: CaFolderUserConfig;

  formGp = new FormBuilder().group({
    folderNotif: [CaFolderNotifOptions.NONE, Validators.required],
    messageNotif: [CaFolderNotifOptions.NONE, Validators.required],
    experimentNotif: [CaFolderNotifOptions.NONE, Validators.required],
    reportNotif: [CaFolderNotifOptions.NONE, Validators.required],
    documentNotif: [CaFolderNotifOptions.NONE, Validators.required],
  });

  getIsLoading: boolean = false;
  isLoading: boolean = false;

  notificationOptions: any = CaFolderNotifOptions;

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaFolderUserConfigDialogInput,
              private folderService: CaFolderService,
              private dialogRef: MatDialogRef<CaFolderUserConfigDialogComponent>,
              private snackBar: FlSnackBarService) {
  }

  ngOnInit(): void {
    this.getIsLoading = true;
    this.folderService.getFolderUserConfig(this.input.folderId).subscribe({
      next: (userConfig) => this.initForm(userConfig),
      error: () => this.getIsLoading = false
    });
  }

  private initForm(userConfig: CaFolderUserConfig): void {
    this.formGp.patchValue(userConfig);
    this.userConfig = userConfig;
    this.getIsLoading = false;
  }

  submit(): void {
    if (!this.isLoading && this.formGp.valid) {
      this.saveConfig();
    }
  }

  private saveConfig(): void {
    this.isLoading = true;
    this.folderService.updateFolderUserConfig(this.input.folderId, this.formGp.getRawValue()).subscribe({
      next: () => this.onSuccess(),
      error: () => this.isLoading = false
    });
  }


  private onSuccess(): void {
    this.snackBar.openSuccessMessage({
      text: 'folder_notif_saved',
      translateText: true
    });
    this.isLoading = false;
    this.dialogRef.close();
  }
}
