import { Component, inject, OnInit } from '@angular/core';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdParamSpecs,
  TdParamSpecsValues,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlDynamicFieldModule, FlDynamicFormGroupConfig } from '@monorepo/front-core-lib/fl-dynamic-field';
import { Streamlit } from 'streamlit-component-lib';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { MatButtonModule } from '@angular/material/button';
import { DcResizeIframeDirective } from '../../core/directive/dc-resize-iframe/dc-resize-iframe.directive';
import { DcCoreMainDirective } from '../../core/directive/dc-core-main/dc-core-main.directive';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { clRxjsDebug } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';

export interface DcProcessConfigConfig {
  process_description: string;
  specs: TdParamSpecs;
  values: TdParamSpecsValues;
  doc_url: string;
  url: string;
}

@Component({
  selector: 'dc-root',
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
  hostDirectives: [DcCoreMainDirective, DcResizeIframeDirective],
})
export class DcProcessConfigComponent implements OnInit {
  processDescription: string;
  formGp: FormGroup<TdConfigureSpecsForm>;
  formConfig: FlDynamicFormGroupConfig;
  configData: TdConfig;

  docUrl: string;

  private mainDirective = inject(DcCoreMainDirective);
  private apiService = inject(FlApiService);

  ngOnInit(): void {
    this.mainDirective.getInitData().subscribe((data) => this.init(data));
  }

  private init(data: DcProcessConfigConfig): void {
    this.configData = TdConfig.fromSpecs(data.specs);
    this.formConfig = this.configData.getDynamicFormFieldsConfig();
    this.formGp = TdConfigureSpecsFormComponent.buildFormGroup({ specs: data.specs, values: data.values });
    this.processDescription = data.process_description;
    this.docUrl = data.doc_url;
    this.apiService.get('/core-api/scenario/running').pipe(clRxjsDebug()).subscribe();
    this.apiService.get('/core-api/scenario/runnijng').subscribe();
  }

  submit(): void {
    if (this.formGp.valid) {
      this.emitValue(this.formGp);
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private emitValue(formGp: FormGroup<TdConfigureSpecsForm>): void {
    if (this.mainDirective.isInitialized) {
      Streamlit.setComponentValue(TdConfigureSpecsFormComponent.buildValues(formGp));
    }
  }
}
