import {Component, Input, OnInit} from '@angular/core';
import {FlDynamicFieldConfigService, FlDynamicFormGroupConfig, FlDynamicFormHelper} from '@monorepo/front-core-lib';
import {LabConfig, LabConfigureSpecsForm} from '../../../../model/entities/lab-config.entity';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {ControlContainer} from '@angular/forms';
import {LabConfigureProcessDynamicField} from '../../lab-configure-process-dynamic-field.service';


/**
 * Use to create a form to create a configuration based on a spec {@link TdParamSpec}
 */
@Component({
  selector: 'lab-configure-specs-form',
  templateUrl: './lab-configure-specs-form.component.html',
  styleUrls: ['./lab-configure-specs-form.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    {provide: FlDynamicFieldConfigService, useClass: LabConfigureProcessDynamicField}
  ]
})
export class LabConfigureSpecsFormComponent implements OnInit {

  @Input() configData: LabConfig;

  publicFormGp: FormGroup;
  protectedFormGp: FormGroup;

  publicConfig: FlDynamicFormGroupConfig;
  protectedConfig: FlDynamicFormGroupConfig;

  showProtectedConfigs: boolean = false;
  protectedConfigExpand: boolean = false;

  constructor(private controlContainer: ControlContainer) {
  }

  // build the form group to configure specs
  public static buildFormGroup(configData: LabConfig): FormGroup<LabConfigureSpecsForm> {
    const value = configData.mergeConfigWithDefault();

    return new FormBuilder().group({
      public: FlDynamicFormHelper.generateFormGroup(configData.getDynamicFormFieldsConfig('public'), value),
      protected: FlDynamicFormHelper.generateFormGroup(configData.getDynamicFormFieldsConfig('protected'), value),
    });
  }

  ngOnInit(): void {
    this.publicConfig = this.configData.getDynamicFormFieldsConfig('public');
    this.protectedConfig = this.configData.getDynamicFormFieldsConfig('protected');
    this.publicFormGp = this.controlContainer.control.get('public') as any;
    this.protectedFormGp = this.controlContainer.control.get('protected') as any;


    this.showProtectedConfigs = this.configData.hasConfigs('protected');
    // Automatically expand the advanced config if there is no public config
    this.protectedConfigExpand = !this.configData.hasConfigs('public');
  }

}
