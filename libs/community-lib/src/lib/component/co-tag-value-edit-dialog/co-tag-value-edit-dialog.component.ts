import { Component, inject, OnInit } from '@angular/core';
import { CoConfig } from '../../service/co-service-config.config';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { CoTagValue, CoTagValueEditDTO } from '../../model/co-tag-value.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { CoTagKeyType } from '../../model/co-tag-key.class';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';

export type CoTagValueEditDialogInput = FlFormDialogInput<Partial<CoTagValueEditDTO>>;

@Component({
  selector: 'co-tag-value-edit-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    ReactiveFormsModule,
    FlCorePipeModule,
    FlLoaderModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    TdTechnicalDocModule,
  ],
  templateUrl: './co-tag-value-edit-dialog.component.html',
  styleUrl: './co-tag-value-edit-dialog.component.scss',
})
export class CoTagValueEditDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CoTagValueEditDTO>, CoTagValue>
  implements OnInit
{
  private coConfig = inject(CoConfig);
  dialogInput: CoTagValueEditDialogInput = inject(MAT_DIALOG_DATA);
  tagKeyType: CoTagKeyType;
  additionalInfoConfig: TdConfig;
  additionalInfoFormGp: FormGroup<TdConfigureSpecsForm>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.tagKeyType = this.dialogInput.object.tagKey.type;
    this.additionalInfoConfig = TdConfig.fromSpecs(
      this.dialogInput.object.tagKey.additionalInfosSpecs ?? {},
      this.dialogInput.object.additionalInfos ?? {}
    );
    this.additionalInfoFormGp = TdConfigureSpecsFormComponent.buildFormGroup(this.additionalInfoConfig);
    this.init();
    this.formGp.controls['tagKey'].patchValue(this.dialogInput.object.tagKey);
    if (this.dialogInput.mode === 'update') {
      this.formGp.controls['value'].disable();
    }
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      value: [null, [Validators.required, this.getValueValidators()]],
      shortDescription: [null],
      additionalInfos: this.additionalInfoFormGp,
      tagKey: [null, Validators.required],
    });
  }

  create(formValue: CoTagValueEditDTO): Observable<CoTagValue> {
    if ('public' in formValue.additionalInfos)
      formValue.additionalInfos = formValue.additionalInfos['public'];
    return this.coConfig.createTagValue(formValue);
  }

  update(formValue: CoTagValueEditDTO): Observable<CoTagValue> {
    if ('public' in formValue.additionalInfos)
      formValue.additionalInfos = formValue.additionalInfos['public'];
    return this.coConfig.updateTagValue(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'coCommunityLib.tag_value_created';
  }

  getUpdateSuccessMessage(): string {
    return 'coCommunityLib.tag_value_updated';
  }

  private getValueValidators(): Validators {
    switch (this.tagKeyType) {
      case CoTagKeyType.STRING:
        return Validators.pattern(/^[\s\S]*$/);
      case CoTagKeyType.INT:
        return Validators.pattern(/^-?\d+$/);
      case CoTagKeyType.FLOAT:
        return Validators.pattern(/^-?\d+(\.\d+)?$/);
      case CoTagKeyType.BOOLEAN:
        return Validators.pattern(/^(true|false)$/);
      case CoTagKeyType.DATETIME:
        return Validators.pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
      default:
        return Validators.nullValidator;
    }
  }
}
