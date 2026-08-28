import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  LiDuplicateFormTemplateDTO,
  LiFormTemplate,
} from '../../../li-core/model/entities/form/li-form-template.entity';
import { LiFormTemplateVersionSummary } from '../../../li-core/model/entities/form/li-form-template-version.entity';
import { LiFormTemplateService } from '../../service/li-form-template.service';

interface LiDuplicateFormFormValue {
  name: string;
  description: string | null;
}

export interface LiFormTemplateDuplicateDialogInput extends FlFormDialogInput<LiDuplicateFormFormValue> {
  /** The source template to fork from. */
  template: LiFormTemplate;
  /** The source version whose schema is copied as the new DRAFT v1. */
  version: LiFormTemplateVersionSummary;
}

@Component({
  selector: 'li-form-template-duplicate-dialog',
  templateUrl: './li-form-template-duplicate-dialog.component.html',
  styleUrl: './li-form-template-duplicate-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiFormTemplateDuplicateDialogComponent
  extends FlFormDialogAbstractDirective<LiDuplicateFormFormValue, LiFormTemplate>
  implements OnInit
{
  private formTemplateService = inject(LiFormTemplateService);

  dialogInput: LiFormTemplateDuplicateDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.prefill();
  }

  private prefill(): void {
    const source = this.dialogInput.template;
    this.formGp.patchValue({
      name: `${source.name} (copy)`,
      description: source.description,
    });
  }

  get title(): string {
    return 'li.form_duplicate_template';
  }

  get sourceVersionLabel(): string {
    return `v${this.dialogInput.version.version}`;
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, Validators.required],
      description: [null],
    });
  }

  create(formValue: LiDuplicateFormFormValue): Observable<LiFormTemplate> {
    const dto: LiDuplicateFormTemplateDTO = {
      name: formValue.name,
      description: formValue.description,
    };
    return this.formTemplateService.duplicateFromVersion(
      this.dialogInput.template.id,
      this.dialogInput.version.id,
      dto
    );
  }

  update(): Observable<LiFormTemplate> {
    throw new Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'li.form_template_duplicated';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
