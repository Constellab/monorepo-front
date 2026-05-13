import { Component, inject, OnInit } from '@angular/core';
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
  LiCreateFormTemplateDTO,
  LiFormTemplate,
} from '../../../li-core/model/entities/form/li-form-template.entity';
import { LiFormTemplateService } from '../../service/li-form-template.service';

export interface LiFormTemplateFormDialogInput extends FlFormDialogInput<LiCreateFormTemplateDTO> {
  templateId?: string;
}

@Component({
  selector: 'li-form-template-form-dialog',
  templateUrl: './li-form-template-form-dialog.component.html',
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
export class LiFormTemplateFormDialogComponent
  extends FlFormDialogAbstractDirective<LiCreateFormTemplateDTO, LiFormTemplate>
  implements OnInit
{
  private formTemplateService = inject(LiFormTemplateService);

  dialogInput: LiFormTemplateFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'li.form_create_template' : 'li.form_update_template';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, Validators.required],
      description: [null],
    });
  }

  create(formValue: LiCreateFormTemplateDTO): Observable<LiFormTemplate> {
    return this.formTemplateService.create(formValue);
  }

  update(formValue: LiCreateFormTemplateDTO): Observable<LiFormTemplate> {
    return this.formTemplateService.update(this.dialogInput.templateId, {
      name: formValue.name,
      description: formValue.description,
    });
  }

  getCreateSuccessMessage(): string {
    return 'li.form_template_created';
  }

  getUpdateSuccessMessage(): string {
    return 'li.form_template_updated';
  }
}
