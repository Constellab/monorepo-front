import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import {
  CaFolderNotifOptions,
  CaFolderUserConfig,
} from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

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
    CdkScrollable,
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
    folderNotif: [CaFolderNotifOptions.NONE, Validators.required],
    messageNotif: [CaFolderNotifOptions.NONE, Validators.required],
    scenarioNotif: [CaFolderNotifOptions.NONE, Validators.required],
    noteNotif: [CaFolderNotifOptions.NONE, Validators.required],
    documentNotif: [CaFolderNotifOptions.NONE, Validators.required],
  });

  getIsLoading: boolean = false;
  isLoading: boolean = false;

  notificationOptions: any = CaFolderNotifOptions;

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
