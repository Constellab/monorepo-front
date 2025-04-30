import { Component, inject } from '@angular/core';
import { CaLab, CaLabType } from '../../../../model/entities/lab/ca-lab.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogModule,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslateParam, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { CaLabService } from '../../../../service-api/ca-lab.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaCurrentSpaceService } from '../../../../service-api/ca-current-space.service';
import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import {
  CaLabDesktopFormDialogComponent,
  CaLabDesktopFormDialogInput,
} from '../ca-lab-desktop-form-dialog/ca-lab-desktop-form-dialog.component';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { CaEnvironmentHelper } from '../../../../utils/ca-environment.helper';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FlRadioButtonBigModule } from '@monorepo/front-core-lib/fl-radio-button-big';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

interface CaFreeLabInfo {
  freeLabAvailable: boolean;
  freeLab: CaLabFreeGetDto;
}

/**
 * Form to create or update a lab accessible by user
 */
@Component({
  selector: 'ca-lab-form-dialog',
  templateUrl: './ca-lab-form-dialog.component.html',
  styleUrls: ['./ca-lab-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    MatRadioGroup,
    ReactiveFormsModule,
    FormsModule,
    MatRadioButton,
    FlRadioButtonBigModule,
    MatIcon,
    MatDivider,
    MatFormField,
    MatLabel,
    MatInput,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabFormDialogComponent {
  private labService = inject(CaLabService);
  private currentSpaceService = inject(CaCurrentSpaceService);
  private dialogService = inject(FlDialogService);

  private translateService = inject(FlTranslateService);
  private communityHelper = inject(CoCommunityHelperService);
  private dialogRef = inject(MatDialogRef);

  fakeModel: string = null;
  // prevent opening multiple dialogs due to click on radio
  dialogOpened: boolean = false;

  freeLabInfo$: Observable<CaFreeLabInfo> = combineLatest([
    this.labService.getCurrentUserFreeLab(),
    this.currentSpaceService.getCurrentSpace$(),
  ]).pipe(
    map(([freeLab, space]) => {
      return {
        freeLabAvailable: freeLab.status === 'NOT_USED' && space.type === 'PERSONAL',
        freeLab,
      };
    })
  );

  formGp = new FormBuilder().group({
    type: [null, [Validators.required]],
    labNeed: [null],
  });

  isLoading: boolean = false;

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      type: [null as CaLabType, [Validators.required]],
      labNeed: [null as string],
    });
  }

  submit(): void {
    if (this.isLoading || this.formGp.invalid) return;

    this.isLoading = true;
    this.labService.requestNewLab(this.formGp.getRawValue()).subscribe({
      next: () => this.onRequestSent(),
      error: () => (this.isLoading = false),
    });
  }

  private onRequestSent(): void {
    this.isLoading = false;
    this.dialogRef.close();
  }

  openDesktopForm(): void {
    if (this.dialogOpened) return;
    const input: CaLabDesktopFormDialogInput = { mode: 'create' };

    this.dialogService
      .openSmallDialog(CaLabDesktopFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((lab) => this.onDesktopFormClosed(lab));
    this.dialogOpened = true;
  }

  private onDesktopFormClosed(lab?: CaLab): void {
    if (lab) {
      this.dialogRef.close(lab);
    }
    this.fakeModel = null;
    this.dialogOpened = false;
  }

  createFreeLab(freeLab: CaFreeLabInfo): void {
    if (!freeLab.freeLabAvailable || this.dialogOpened) return;
    const params: FlTranslateParam = {
      param: {
        usageLimit: freeLab.freeLab.standardInfo.usageLimitInHours,
        nbCpus: freeLab.freeLab.standardInfo.nbCpus,
        ramSize: freeLab.freeLab.standardInfo.ramSize,
        storageSize: freeLab.freeLab.standardInfo.diskSize,
        supportMail: CaEnvironmentHelper.getSupportMail(),
        overviewLink: this.communityHelper.getDataLabOverviewRoute(),
        configureLink: this.communityHelper.getDataLabManagementRoute(),
      },
    };

    const text = `<p>${this.translateService.translate('start_free_data_lab_confirmation_1', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_2', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_3', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_4', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_5', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_6', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_7', params)}</p>`;
    const input: FlConfirmDialogInput = {
      title: 'start_free_data_lab',
      content: { text: text, translateText: false },
      observable: this.labService.createFreeLabCurrentUser(),
      successMessage: 'free_data_lab_started',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onCreateFreeLabDialogClosed(result));

    this.dialogOpened = true;
  }

  private onCreateFreeLabDialogClosed(result: FlConfirmDialogResult<CaLab>): void {
    if (result.choice) {
      this.dialogRef.close(result.result);
    }
    this.fakeModel = null;
    this.dialogOpened = false;
  }
}
