import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { HaTagValue, HaTagValueEditDTO } from '../../../ha-core/ha-model/ha-entities/ha-tag-value.class';
import { HaTagService } from '../../../ha-core/ha-service/ha-tag.service';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatButton } from '@angular/material/button';
import { CoTagKeyAdditionalInfosSpecs, CoTagKeyType } from '@monorepo/community-lib';

export type HaTagValueEditDialogInput = FlFormDialogInput<Partial<HaTagValueEditDTO>>;

@Component({
  selector: 'ha-tag-value-edit-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    FlCorePipeModule,
    FlLoaderModule,
    MatButton,
    MatError,
    MatLabel,
  ],
  templateUrl: './ha-tag-value-edit-dialog.component.html',
  styleUrl: './ha-tag-value-edit-dialog.component.scss',
})
export class HaTagValueEditDialogComponent
  extends FlFormDialogAbstractDirective<Partial<HaTagValueEditDTO>, HaTagValue>
  implements OnInit
{
  private tagService = inject(HaTagService);
  dialogInput: HaTagValueEditDialogInput = inject(MAT_DIALOG_DATA);
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

  create(formValue: HaTagValueEditDTO): Observable<HaTagValue> {
    formValue = this.cleanFormValue(formValue);
    return this.tagService.createValue(formValue);
  }

  update(formValue: HaTagValueEditDTO): Observable<HaTagValue> {
    formValue = this.cleanFormValue(formValue);
    return this.tagService.updateValue(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'tag_value_created';
  }

  getUpdateSuccessMessage(): string {
    return 'tag_value_updated';
  }

  cleanFormValue(formValue: HaTagValueEditDTO): HaTagValueEditDTO {
    formValue.additionalInfos = {};
    const jsonFormValue = JSON.parse(JSON.stringify(formValue));
    for (const key in this.additionalInfoSpecs) {
      formValue.additionalInfos[key] = jsonFormValue[key];
    }
    return formValue;
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
