import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FlSnackBarService} from '@monorepo/front-core-lib';
import {
  CaProjectNotifOptions,
  CaProjectUserConfig
} from '../../../../../ca-core/model/entities/project/ca-project-user.class';
import {FormBuilder, Validators} from '@angular/forms';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';

export interface CaProjectUserConfigDialogInput {
  projectId: string;
}

/**
 * Dialog for a user to update its configuration for a project
 * For now this only contains the notification options
 */
@Component({
  selector: 'ca-project-user-config-dialog',
  templateUrl: './ca-project-user-config-dialog.component.html',
  styleUrls: ['./ca-project-user-config-dialog.component.scss']
})
export class CaProjectUserConfigDialogComponent implements OnInit {

  userConfig: CaProjectUserConfig;

  formGp = new FormBuilder().group({
    projectNotif: [CaProjectNotifOptions.NONE, Validators.required],
    commentNotif: [CaProjectNotifOptions.NONE, Validators.required],
    experimentNotif: [CaProjectNotifOptions.NONE, Validators.required],
    reportNotif: [CaProjectNotifOptions.NONE, Validators.required],
    documentNotif: [CaProjectNotifOptions.NONE, Validators.required],
  });

  getIsLoading: boolean = false;
  isLoading: boolean = false;

  notificationOptions: any = CaProjectNotifOptions;

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaProjectUserConfigDialogInput,
              private projectService: CaProjectService,
              private dialogRef: MatDialogRef<CaProjectUserConfigDialogComponent>,
              private snackBar: FlSnackBarService) {
  }

  ngOnInit(): void {
    this.getIsLoading = true;
    this.projectService.getProjectUserConfig(this.input.projectId).subscribe({
      next: (userConfig) => this.initForm(userConfig),
      error: () => this.getIsLoading = false
    });
  }

  private initForm(userConfig: CaProjectUserConfig): void {
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
    this.projectService.updateProjectUserConfig(this.input.projectId, this.formGp.getRawValue()).subscribe({
      next: () => this.onSuccess(),
      error: () => this.isLoading = false
    });
  }


  private onSuccess(): void {
    this.snackBar.openSuccessMessage({
      text: 'project_notif_saved',
      translateText: true
    });
    this.isLoading = false;
    this.dialogRef.close();
  }
}
