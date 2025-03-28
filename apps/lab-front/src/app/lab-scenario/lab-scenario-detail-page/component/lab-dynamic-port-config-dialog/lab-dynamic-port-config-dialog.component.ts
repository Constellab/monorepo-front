import { Component, inject } from '@angular/core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlRadioButtonBigModule } from '@monorepo/front-core-lib/fl-radio-button-big';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LiSelectTypeComponent } from '@monorepo/lab-lib/li-type';
import { LiTypeEntity } from '@monorepo/lab-lib/li-core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { PrWorkflowPortType } from '@monorepo/protocol';
import { TdIOSpec } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabDynamicPortConfigDialogInput {
  portType: PrWorkflowPortType;
  portName: string;
  spec: TdIOSpec;
}

interface LabFormType {
  resourceType: FormControl<LiTypeEntity>;
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
    MatDialogContent,
    ReactiveFormsModule,
    FlFormModule,
    LiSelectTypeComponent,
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
      resourceType: new FormControl(LiTypeEntity.fromResourceType(data.spec.resource_types[0])),
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
