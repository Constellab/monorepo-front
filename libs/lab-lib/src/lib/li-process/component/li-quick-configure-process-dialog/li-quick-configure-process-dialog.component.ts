import { AsyncPipe } from '@angular/common';
import { Component, inject,OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiProcessDynamicFieldConfig } from '@monorepo/lab-lib/li-config';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdParamSpecs,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface LiQuickConfigureProcessDialogInput {
  title: FlTranslatableText;
  helpText?: FlTranslatableText;
  specs$: Observable<TdParamSpecs>;
}

/**
 * Dialog to load a process configuration, and configure it.
 * This dialog is independent of playground
 * Then trigger an action (like creating a scenario)
 */
@Component({
  selector: 'li-quick-configure-process-dialog',
  templateUrl: './li-quick-configure-process-dialog.component.html',
  styleUrl: './li-quick-configure-process-dialog.component.scss',
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LiProcessDynamicFieldConfig },
  ],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslatePipe,
    FlTranslateModule,
    TdTechnicalDocModule,
  ],
})
export class LiQuickConfigureProcessDialogComponent implements OnInit {
  input: LiQuickConfigureProcessDialogInput = inject(MAT_DIALOG_DATA);

  formGp: FormGroup<TdConfigureSpecsForm>;
  processConfig: TdConfig;

  getIsLoading: boolean = true;

  private dialogRef = inject(MatDialogRef);

  ngOnInit(): void {
    this.getSpecs();
  }

  private getSpecs(): void {
    this.input.specs$.subscribe({
      next: (specs: TdParamSpecs) => this.getSpecsSuccess(specs),
      error: () => (this.getIsLoading = false),
    });
  }

  private getSpecsSuccess(specs: TdParamSpecs): void {
    this.processConfig = TdConfig.fromSpecs(specs, null);
    this.formGp = TdConfigureSpecsFormComponent.buildFormGroup(this.processConfig);

    this.getIsLoading = false;
  }

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(TdConfigureSpecsFormComponent.buildValues(this.formGp));
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }
}
