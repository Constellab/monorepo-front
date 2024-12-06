import {
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  OnInit,
  Signal,
  ViewContainerRef,
} from '@angular/core';
import {
  FlDialogService,
  FlDynamicEditableFormGroupConfig,
  FlDynamicFieldConfigService,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
} from '@monorepo/front-core-lib';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { LabConfigureProcessDynamicField } from '../../lab-configure-process-dynamic-field.service';
import { PrConfig } from '@monorepo/protocol';
import {
  TdAbstractDynamicParamSpecState,
  TdConfigureParamSpecsTableDialogComponent,
  TdConfigureParamSpecsTableDialogInput,
  TdParamSpecs,
} from '@monorepo/technical-doc';
import { LabProcess } from '../../../../model/entities/process/lab-process.entity';
import { LabDynamicParamSpecState } from '../../state/lab-dynamic-param-spec.state';
import { LabProcessDashboardState } from '../../../../../lab-scenario/lab-scenario-detail-page/state/lab-process-dashboard.state';
import { Subscription } from 'rxjs';

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
    { provide: TdAbstractDynamicParamSpecState, useClass: LabDynamicParamSpecState },
  ],
})
export class LabConfigureSpecsFormComponent implements OnInit, OnDestroy {
  configData = input<LabConfig>();
  process = input<LabProcess>();

  publicFormGp: Signal<UntypedFormGroup> = computed(() => {
    return this.dashboardState.getTaskFormGp()().get('public') as any;
  });
  protectedFormGp: Signal<UntypedFormGroup> = computed(() => {
    return this.dashboardState.getTaskFormGp()().get('protected') as any;
  });

  publicConfig: Signal<FlDynamicFormGroupConfig | FlDynamicEditableFormGroupConfig> = computed(() => {
    return this.configData().getDynamicFormFieldsConfig('public');
  });

  protectedConfig: Signal<FlDynamicFormGroupConfig> = computed(() => {
    return this.configData().getDynamicFormFieldsConfig('protected');
  });

  showProtectedConfigs: Signal<boolean> = computed(() => this.configData().hasConfigs('protected'));
  protectedConfigExpand: Signal<boolean> = computed(() => !this.configData().hasConfigs('public'));

  dynamicParamsOnEditSubscriptions: Subscription[] = [];

  constructor(
    private dialogService: FlDialogService,
    private editParamSpecState: TdAbstractDynamicParamSpecState,
    private viewContainerRef: ViewContainerRef,
    private dashboardState: LabProcessDashboardState
  ) {
    effect(() => {
      for (const config of Object.keys(this.publicConfig().subConfigs)) {
        if (this.publicConfig().subConfigs[config].controlType == 'editableFormGroup') {
          this.dynamicParamsOnEditSubscriptions.push(
            (
              this.publicConfig().subConfigs[config] as FlDynamicEditableFormGroupConfig
            ).openEditConfigDialog.subscribe((configSpecName) => this.openEditConfigDialog(configSpecName))
          );
        }
      }
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
    (this.editParamSpecState as LabDynamicParamSpecState).init(this.process());
  }

  openEditConfigDialog(configSpecName: string): void {
    if (!this.process()) return;

    if (
      this.configData().specs[configSpecName] &&
      this.configData().specs[configSpecName].type == 'dynamic'
    ) {
      const paramsSpecs: TdParamSpecs = this.configData().specs[configSpecName].additional_info.specs;

      const input: TdConfigureParamSpecsTableDialogInput = {
        paramSpecs: paramsSpecs,
        configSpecName: configSpecName,
      };

      this.dialogService
        .openBigDialog(TdConfigureParamSpecsTableDialogComponent, {
          data: input,
          viewContainerRef: this.viewContainerRef,
        })
        .afterClosed()
        .subscribe((config: LabConfig) => {
          if (config) {
            this.dashboardState.updateConfig(config);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.editParamSpecState.onDestroy();
    for (const configEditSubscription of this.dynamicParamsOnEditSubscriptions) {
      configEditSubscription.unsubscribe();
    }
    this.dynamicParamsOnEditSubscriptions = [];
  }
}
