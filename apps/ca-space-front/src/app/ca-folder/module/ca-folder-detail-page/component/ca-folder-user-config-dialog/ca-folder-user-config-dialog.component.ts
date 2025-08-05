import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaFolderUserConfig,
  CaRootFolderNotifOptions,
} from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';

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
  styleUrls: ['./ca-folder-user-config-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    ReactiveFormsModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatRadioGroup,
    MatRadioButton,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaFolderUserConfigDialogComponent implements OnInit {
  private input = inject<CaFolderUserConfigDialogInput>(MAT_DIALOG_DATA);
  private folderService = inject(CaFolderService);
  private dialogRef = inject<MatDialogRef<CaFolderUserConfigDialogComponent>>(MatDialogRef);
  private snackBar = inject(FlSnackBarService);

  userConfig: CaFolderUserConfig;

  formGp = new FormBuilder().group({
    folderNotif: [CaRootFolderNotifOptions.NONE, Validators.required],
    messageNotif: [CaRootFolderNotifOptions.NONE, Validators.required],
    scenarioNotif: [CaRootFolderNotifOptions.NONE, Validators.required],
    noteNotif: [CaRootFolderNotifOptions.NONE, Validators.required],
    documentNotif: [CaRootFolderNotifOptions.NONE, Validators.required],
  });

  getIsLoading: boolean = false;
  isLoading: boolean = false;

  notificationOptions: any = CaRootFolderNotifOptions;

  ngOnInit(): void {
    this.getIsLoading = true;
    this.folderService.getFolderUserConfig(this.input.folderId).subscribe({
      next: (userConfig) => this.initForm(userConfig),
      error: () => (this.getIsLoading = false),
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
      error: () => (this.isLoading = false),
    });
  }

  private onSuccess(): void {
    this.snackBar.openSuccessMessage({
      text: 'folder_notif_saved',
      translateText: true,
    });
    this.isLoading = false;
    this.dialogRef.close();
  }
}
