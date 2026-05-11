import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LiFormContent, LiSaveFormDTO } from '../../model/li-form.entity';
import { LiFormService } from '../../service/li-form.service';
import { LiFormDynamicFieldConfig } from '../../service/li-form-dynamic-field-config.service';
import { liBuildSaveDTO, liExtractSavePayload } from './li-form-editor.logic';

@Component({
  selector: 'li-form-editor',
  templateUrl: './li-form-editor.component.html',
  styleUrl: './li-form-editor.component.scss',
  imports: [TdTechnicalDocModule, ReactiveFormsModule, MatButton, TranslatePipe, FlIconModule],
  providers: [{ provide: FlDynamicFieldConfigService, useClass: LiFormDynamicFieldConfig }],
})
export class LiFormEditorComponent {
  private formService = inject(LiFormService);
  private snackBar = inject(FlSnackBarService);

  formId = input.required<string>();
  content = input.required<LiFormContent>();
  readonly = input<boolean>(false);

  contentSaved = output<LiFormContent>();
  contentSubmitted = output<LiFormContent>();

  isSaving = signal(false);
  configData = signal<TdConfig>(null);
  formGp: FormGroup<TdConfigureSpecsForm>;

  constructor() {
    effect(() => {
      const c = this.content();
      if (c?.specs) {
        this.initForm(c);
      }
    });

    effect(() => {
      if (this.readonly()) {
        this.formGp?.disable({ emitEvent: false });
      } else {
        this.formGp?.enable({ emitEvent: false });
      }
    });
  }

  save(): void {
    const values = this.getCleanValues();
    const dto = liBuildSaveDTO(values);

    this.isSaving.set(true);
    this.formService.save(this.formId(), dto).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.snackBar.openSuccessMessage({ text: 'li.form_saved', translateText: true });
        this.contentSaved.emit(response);
      },
      error: () => this.isSaving.set(false),
    });
  }

  submit(): void {
    const values = this.getCleanValues();
    const dto: LiSaveFormDTO = { values, status_transition: 'SUBMITTED' };

    this.isSaving.set(true);
    this.formService.save(this.formId(), dto).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.snackBar.openSuccessMessage({ text: 'li.form_submitted', translateText: true });
        this.contentSubmitted.emit(response);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        if (err.status === 422 && err.error?.missing_mandatory_fields?.length) {
          this.highlightMissingFields(err.error.missing_mandatory_fields);
          this.snackBar.openErrorMessage({
            text: 'li.form_missing_mandatory_fields',
            translateText: true,
          });
        }
      },
    });
  }

  aiFillFromText = (text: string): Observable<LiFormContent> => {
    const currentValues = this.getCleanValues();
    return this.formService.fillFromText(this.formId(), text, currentValues);
  };

  onAiFillResult(result: unknown): void {
    const content = result as LiFormContent;
    this.initForm(content);
    this.formGp.markAsDirty();
    this.snackBar.openSuccessMessage({ text: 'li.form_ai_fill_applied', translateText: true });
  }

  private initForm(content: LiFormContent): void {
    const config = TdConfig.fromSpecs(content.specs, content.values ?? {});
    this.configData.set(config);
    this.formGp = TdConfigureSpecsFormComponent.buildFormGroup(config);

    if (this.readonly()) {
      this.formGp.disable({ emitEvent: false });
    }
  }

  private getCleanValues(): Record<string, unknown> {
    const rawValues = TdConfigureSpecsFormComponent.buildValues(this.formGp);
    return liExtractSavePayload(rawValues, this.content().specs);
  }

  private highlightMissingFields(fields: string[]): void {
    for (const fieldPath of fields) {
      const control = this.formGp.get(['public', fieldPath]) ?? this.formGp.get(['protected', fieldPath]);
      if (control) {
        control.markAsTouched();
        control.setErrors({ required: true });
      }
    }
  }
}
