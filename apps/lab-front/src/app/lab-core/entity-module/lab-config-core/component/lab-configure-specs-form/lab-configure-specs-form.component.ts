import { Component, effect, input, OnDestroy, OnInit, output, ViewContainerRef } from '@angular/core';
import {
  FlDialogService,
  FlDynamicFieldConfigService,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper
} from '@monorepo/front-core-lib';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import { ControlContainer, FormBuilder, UntypedFormGroup } from '@angular/forms';
import { LabConfigureProcessDynamicField } from '../../lab-configure-process-dynamic-field.service';
import { PrConfig } from '@monorepo/protocol';
import {
  TdConfigureParamSpecsTableDialogComponent,
  TdConfigureParamSpecsTableDialogInput,
  TdParamSpecs
} from '@monorepo/technical-doc';
import { LabProcess } from '../../../../model/entities/process/lab-process.entity';
import { LabDynamicParamSpecState } from '../../state/lab-dynamic-param-spec.state';

/**
 * Use to create a form to create a configuration based on a spec {@link TdParamSpec}
 */
@Component({
  selector: 'lab-configure-specs-form',
  templateUrl: './lab-configure-specs-form.component.html',
  styleUrls: ['./lab-configure-specs-form.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LabConfigureProcessDynamicField },
    LabDynamicParamSpecState,
  ],
})
export class LabConfigureSpecsFormComponent implements OnInit, OnDestroy {
  configData = input<LabConfig>();
  process = input<LabProcess>();

  reInitFormGp = output<LabConfig>();

  publicFormGp: UntypedFormGroup;
  protectedFormGp: UntypedFormGroup;

  publicConfig: FlDynamicFormGroupConfig;
  protectedConfig: FlDynamicFormGroupConfig;

  showProtectedConfigs: boolean = false;
  protectedConfigExpand: boolean = false;

  constructor(
    private controlContainer: ControlContainer,
    private dialogService: FlDialogService,
    private editParamSpecState: LabDynamicParamSpecState,
    private viewContainerRef: ViewContainerRef
  ) {
    effect(() => {
      this.init();
    });
  }

  // build the form group to configure specs
  public static buildFormGroup(configData: PrConfig): UntypedFormGroup {
    const labConfig = LabConfig.fromSpecs(configData.specs, configData.values);
    const value = labConfig.mergeConfigWithDefault();

    return new FormBuilder().group({
      public: FlDynamicFormHelper.generateFormGroup(labConfig.getDynamicFormFieldsConfig('public'), value),
      protected: FlDynamicFormHelper.generateFormGroup(
        labConfig.getDynamicFormFieldsConfig('protected'),
        value
      ),
    });
  }

  ngOnInit(): void {
    this.editParamSpecState.init(this.process());
  }

  init(): void {
    this.publicConfig = this.configData().getDynamicFormFieldsConfig('public');
    this.protectedConfig = this.configData().getDynamicFormFieldsConfig('protected');
    this.publicFormGp = this.controlContainer.control.get('public') as any;
    this.protectedFormGp = this.controlContainer.control.get('protected') as any;
    this.showProtectedConfigs = this.configData().hasConfigs('protected');
    // Automatically expand the advanced config if there is no public config
    this.protectedConfigExpand = !this.configData().hasConfigs('public');
  }

  openEditParamSpecsDialog(): void {
    if (!this.process()) return;

    if (this.configData().specs['params'] && this.configData().specs['params'].type == 'dynamic') {
      const paramsSpecs: TdParamSpecs = this.configData().specs['params'].additional_info.specs;

      const input: TdConfigureParamSpecsTableDialogInput = {
        paramSpecs: paramsSpecs,
        dynamicParamSpecState: this.editParamSpecState,
      };

      this.dialogService
        .openBigDialog(TdConfigureParamSpecsTableDialogComponent, {
          data: input,
          viewContainerRef: this.viewContainerRef,
        })
        .afterClosed()
        .subscribe((config: LabConfig) => {
          if (config) {
            this.reInitFormGp.emit(config);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.editParamSpecState.onDestroy();
  }
}
