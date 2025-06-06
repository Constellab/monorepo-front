import { Component, inject, OnInit } from '@angular/core';
import { CoConfig } from '../../service/co-service-config.config';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { CoTagValue, CoTagValueEditDTO } from '../../model/co-tag-value.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { CoTagKeyAdditionalInfosSpecs, CoTagKeyType } from '../../model/co-tag-key.class';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

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
    MatLabel
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
  additionalInfoSpecs: CoTagKeyAdditionalInfosSpecs;
  tagKeyType: CoTagKeyType;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.tagKeyType = this.dialogInput.object.tagKey.type;
    this.init();
    this.formGp.controls['tagKey'].patchValue(this.dialogInput.object.tagKey);
    if (this.dialogInput.mode === 'update') {
      this.formGp.controls['value'].disable();
    }
  }

  buildForm(): UntypedFormGroup {
    const formGp: FormGroup = new FormBuilder().group({
      id: [null],
      value: [null, [Validators.required, this.getValueValidators()]],
      shortDescription: [null],
      additionalInfos: [null],
      tagKey: [null, Validators.required],
    });

    this.additionalInfoSpecs = this.dialogInput.object.tagKey?.additionalInfosSpecs;
    const additionalInfos = this.dialogInput.object.additionalInfos || {};
    for (const key in this.additionalInfoSpecs) {
      const spec = this.additionalInfoSpecs[key];
      const value = additionalInfos[key] || null;
      formGp.addControl(key, new FormBuilder().control(value, spec.optional ? [] : [Validators.required]));
    }

    return formGp;
  }

  create(formValue: CoTagValueEditDTO): Observable<CoTagValue> {
    formValue = this.cleanFormValue(formValue);
    return this.coConfig.createTagValue(formValue);
  }

  update(formValue: CoTagValueEditDTO): Observable<CoTagValue> {
    formValue = this.cleanFormValue(formValue);
    return this.coConfig.updateTagValue(formValue);
  }

  cleanFormValue(formValue: CoTagValueEditDTO): CoTagValueEditDTO {
    formValue.additionalInfos = {};
    const jsonFormValue = JSON.parse(JSON.stringify(formValue));
    for (const key in this.additionalInfoSpecs) {
      formValue.additionalInfos[key] = jsonFormValue[key];
    }
    return formValue;
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
