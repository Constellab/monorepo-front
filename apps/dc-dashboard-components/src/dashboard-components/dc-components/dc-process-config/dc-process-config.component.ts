import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlDebouncer, FlFormHelper } from '@monorepo/front-core-lib/fl-core';
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
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DcAuthenticationInfo, DcDynamicComponent } from '../../../core/model/dc-dynamic-component.class';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';

export interface DcProcessConfigConfig {
  is_dialog: boolean;
  process_description: string;
  specs: TdParamSpecs;
  values: TdParamSpecsValues;
  doc_url: string;
  url: string;
}

export interface DcProcessConfigOutput {
  config: TdParamSpecsValues;
  is_valid: boolean;
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
    NgClass,
  ],
  templateUrl: './dc-process-config.component.html',
  styleUrl: './dc-process-config.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  hostDirectives: [DcCoreMainDirective],
})
export class DcProcessConfigComponent
implements OnInit, DcDynamicComponent<DcProcessConfigConfig, TdParamSpecsValues>, OnDestroy
{
  @Input() inputData: DcProcessConfigConfig;
  @Input() authenticationInfo?: DcAuthenticationInfo;
  @Output() outputEvent = new EventEmitter<DcProcessConfigOutput>();

  processDescription: string;
  formGp: FormGroup<TdConfigureSpecsForm>;
  formConfig: FlDynamicFormGroupConfig;
  configData: TdConfig;

  docUrl: string;

  formSubscription: Subscription;

  private mainDirective = inject(DcCoreMainDirective);

  ngOnInit(): void {
    this.mainDirective.init(this.authenticationInfo);
    this.init(this.inputData);
  }

  private init(data: DcProcessConfigConfig): void {
    this.configData = TdConfig.fromSpecs(data.specs);
    this.formConfig = this.configData.getDynamicFormFieldsConfig();
    this.formGp = TdConfigureSpecsFormComponent.buildFormGroup({ specs: data.specs, values: data.values });
    this.processDescription = data.process_description;
    this.docUrl = data.doc_url;
    if (!data.is_dialog) {
      this.formSubscription = this.formGp.valueChanges
        .pipe(debounceTime(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME))
        .subscribe(() => {
          this.emitValue(this.formGp, this.formGp.valid);
        });
    }
  }

  submit(): void {
    if (this.formGp.valid) {
      this.emitValue(this.formGp, true);
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }

  private emitValue(formGp: FormGroup<TdConfigureSpecsForm>, valid: boolean): void {
    this.outputEvent.emit({ config: TdConfigureSpecsFormComponent.buildValues(formGp), is_valid: valid });
  }
}
