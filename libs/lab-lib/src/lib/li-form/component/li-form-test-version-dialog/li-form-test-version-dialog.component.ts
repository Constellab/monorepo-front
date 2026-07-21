import { ChangeDetectionStrategy,Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdParamSpecs,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormContent } from '../../../li-core/model/entities/form/li-form.entity';
import { LiFormDynamicFieldConfig } from '../../service/li-form-dynamic-field-config.service';
import { LiFormTemplateService } from '../../service/li-form-template.service';
import { liExtractSavePayload } from '../li-form-editor/li-form-editor.logic';

interface LiFormTestVersionResult {
  result: LiFormContent;
  errors: string[];
}

export interface LiFormTestVersionDialogInput {
  templateId: string;
  versionId: string;
  specs: TdParamSpecs;
}

@Component({
  selector: 'li-form-test-version-dialog',
  templateUrl: './li-form-test-version-dialog.component.html',
  styleUrl: './li-form-test-version-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    MatIcon,
    TdTechnicalDocModule,
    ReactiveFormsModule,
    MatButton,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [{ provide: FlDynamicFieldConfigService, useClass: LiFormDynamicFieldConfig }],
})
export class LiFormTestVersionDialogComponent {
  private formTemplateService = inject(LiFormTemplateService);
  private dialogData: LiFormTestVersionDialogInput = inject(MAT_DIALOG_DATA);

  private templateId = this.dialogData.templateId;
  private versionId = this.dialogData.versionId;
  private specs = this.dialogData.specs;

  isTesting = signal(false);
  testErrors = signal<string[]>([]);
  testValid = signal<boolean | null>(null);
  configData = signal<TdConfig>(null);
  formGp: FormGroup<TdConfigureSpecsForm>;

  constructor() {
    this.initForm(this.specs, {});
  }

  private initForm(specs: TdParamSpecs, values: Record<string, unknown>): void {
    const config = TdConfig.fromSpecs(specs, values);
    this.configData.set(config);
    this.formGp = TdConfigureSpecsFormComponent.buildFormGroup(config);
  }

  test(): void {
    FlFormHelper.markAllAsTouched(this.formGp);
    const rawValues = TdConfigureSpecsFormComponent.buildValues(this.formGp);
    const values = liExtractSavePayload(rawValues, this.specs);

    this.isTesting.set(true);
    this.testValid.set(null);
    this.testErrors.set([]);
    this.formTemplateService.testVersion(this.templateId, this.versionId, values).subscribe({
      next: (response: LiFormTestVersionResult) => {
        this.isTesting.set(false);
        this.patchValues(response.result.values ?? {});
        this.applyTestResult(response);
      },
      error: () => {
        this.isTesting.set(false);
      },
    });
  }

  private patchValues(values: Record<string, unknown>): void {
    const config = TdConfig.fromSpecs(this.specs, {});
    const split = config.splitValuesByVisibility(values);
    this.formGp.patchValue(split);
  }

  private applyTestResult(response: LiFormTestVersionResult): void {
    this.testValid.set(response.errors.length === 0);
    this.testErrors.set(response.errors);
  }
}
