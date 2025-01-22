import { Component, inject } from '@angular/core';
import { TdIOSpec } from '@monorepo/technical-doc';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { PrWorkflowPortType } from '@monorepo/protocol';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabTypeEntity } from '../../../../lab-core/model/entities/lab-type/lab-type.entity';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlFormModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSelectTypeComponent } from '../../../../lab-core/entity-module/lab-type-core/component/lab-select-type/lab-select-type.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { FlRadioButtonBigModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-radio-button-big/fl-radio-button-big.module';
import { MatButton } from '@angular/material/button';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabDynamicPortConfigDialogInput {
  portType: PrWorkflowPortType;
  portName: string;
  spec: TdIOSpec;
}

interface LabFormType {
  resourceType: FormControl<LabTypeEntity>;
  humanName: FormControl<string>;
  shortDescription: FormControl<string>;
  isOptional: FormControl<boolean>;
  isConstant: FormControl<boolean>;
  subClass: FormControl<boolean>;
}

/**
 * Dialog to configure dynamic ports
 */
@Component({
  selector: 'lab-dynamic-port-config-dialog',
  templateUrl: './lab-dynamic-port-config-dialog.component.html',
  styleUrls: ['./lab-dynamic-port-config-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FlFormModule,
    LabSelectTypeComponent,
    MatError,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatRadioGroup,
    MatRadioButton,
    FlRadioButtonBigModule,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabDynamicPortConfigDialogComponent {
  private dialogRef = inject<MatDialogRef<LabDynamicPortConfigDialogComponent>>(MatDialogRef);

  portType: PrWorkflowPortType;
  formGp: FormGroup<LabFormType>;

  constructor() {
    const data = inject<LabDynamicPortConfigDialogInput>(MAT_DIALOG_DATA);

    this.portType = data.portType;
    this.formGp = new FormBuilder().group({
      resourceType: new FormControl(LabTypeEntity.fromResourceType(data.spec.resource_types[0])),
      humanName: new FormControl(data.spec.human_name),
      shortDescription: new FormControl(data.spec.short_description),
      isOptional: new FormControl(data.spec.is_optional),
      isConstant: new FormControl(data.spec.is_constant),
      // force subClass to true if portType is output
      subClass: new FormControl(data.portType === 'output'),
    });
  }

  submit(): void {
    if (this.formGp.valid) {
      const value = this.formGp.getRawValue();
      const spec: TdIOSpec = {
        resource_types: [value.resourceType.toTypeRef()],
        human_name: value.humanName,
        short_description: value.shortDescription,
        is_optional: value.isOptional,
        is_constant: value.isConstant,
        sub_class: value.subClass,
      };
      this.dialogRef.close(spec);
    }
  }
}
