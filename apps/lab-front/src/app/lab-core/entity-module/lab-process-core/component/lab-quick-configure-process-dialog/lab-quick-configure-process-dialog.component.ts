import { Component, inject, OnInit } from '@angular/core';
import { FlDynamicFieldConfigService, FlTranslatableText } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import { LabProcessDynamicFieldConfig } from '../../../lab-config-core/lab-process-dynamic-field-config.service';
import {
  LabConfigureSpecsForm,
  LabConfigureSpecsFormComponent,
} from '../../../lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlTranslateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-translate/fl-translate.module';

export interface LabQuickConfigureProcessDialogInput {
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
  selector: 'lab-quick-configure-process-dialog',
  templateUrl: './lab-quick-configure-process-dialog.component.html',
  styleUrl: './lab-quick-configure-process-dialog.component.scss',
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LabProcessDynamicFieldConfig },
  ],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    ReactiveFormsModule,
    LabConfigureSpecsFormComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslatePipe,
    FlTranslateModule,
  ],
})
export class LabQuickConfigureProcessDialogComponent implements OnInit {
  input: LabQuickConfigureProcessDialogInput = inject(MAT_DIALOG_DATA);

  formGp: FormGroup<LabConfigureSpecsForm>;
  processConfig: LabConfig;

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
    this.processConfig = LabConfig.fromSpecs(specs, null);
    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(this.processConfig);

    this.getIsLoading = false;
  }

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(LabConfigureSpecsFormComponent.buildValues(this.formGp));
    }
  }
}
