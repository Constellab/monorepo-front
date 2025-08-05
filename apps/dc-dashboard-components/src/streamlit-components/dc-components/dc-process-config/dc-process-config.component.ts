import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlDynamicFieldModule, FlDynamicFormGroupConfig } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdParamSpecs,
  TdParamSpecsValues,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';

import { DcComponentData, DcDynamicComponent } from '../../../core/model/dc-dynamic-component.class';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';

export interface DcProcessConfigConfig {
  process_description: string;
  specs: TdParamSpecs;
  values: TdParamSpecsValues;
  doc_url: string;
  url: string;
}

@Component({
  selector: 'dc-process-config',
  imports: [
    FlDynamicFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlTranslateModule,
    TdTechnicalDocModule,
    MatIconModule,
  ],
  templateUrl: './dc-process-config.component.html',
  styleUrl: './dc-process-config.component.scss',
  hostDirectives: [DcCoreMainDirective],
})
export class DcProcessConfigComponent
implements OnInit, DcDynamicComponent<DcProcessConfigConfig, TdParamSpecsValues>
{
  @Input() inputData: DcComponentData<DcProcessConfigConfig>;
  @Output() outputEvent = new EventEmitter<TdParamSpecsValues>();

  processDescription: string;
  formGp: FormGroup<TdConfigureSpecsForm>;
  formConfig: FlDynamicFormGroupConfig;
  configData: TdConfig;

  docUrl: string;

  private mainDirective = inject(DcCoreMainDirective);

  ngOnInit(): void {
    this.mainDirective.init(this.inputData);
    this.init(this.inputData.component_data);
  }

  private init(data: DcProcessConfigConfig): void {
    this.configData = TdConfig.fromSpecs(data.specs);
    this.formConfig = this.configData.getDynamicFormFieldsConfig();
    this.formGp = TdConfigureSpecsFormComponent.buildFormGroup({ specs: data.specs, values: data.values });
    this.processDescription = data.process_description;
    this.docUrl = data.doc_url;
  }

  submit(): void {
    if (this.formGp.valid) {
      this.emitValue(this.formGp);
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private emitValue(formGp: FormGroup<TdConfigureSpecsForm>): void {
    this.outputEvent.emit(TdConfigureSpecsFormComponent.buildValues(formGp));
  }
}
