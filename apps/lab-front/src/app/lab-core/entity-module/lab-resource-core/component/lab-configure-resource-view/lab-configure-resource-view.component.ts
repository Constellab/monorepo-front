import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  LabResourceViewSpec,
  LabResourceViewSpecWithConfig,
} from '../../../../model/entities/resource/lab-resource-view.entity';
import { FL_PORTAL_DATA, FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { Observable } from 'rxjs';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdParamSpecsValues,
  TdTechnicalDocModule,
  TdTypeStyle,
} from '@monorepo/technical-doc';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabProcessDynamicFieldConfig } from '../../../lab-config-core/lab-process-dynamic-field-config.service';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabConfigureResourceViewInput {
  resourceTypingName: string;
  resourceId?: string;
  title: string;
  viewMethodName: string;
  viewStyle: TdTypeStyle;

  preConfiguration?: LabResourceViewSpecWithConfig;
}

export interface LabConfigureResourceViewOutput {
  viewMethodName: string;
  viewConfigValues: TdParamSpecsValues;
}

/**
 * Portal to configure resource view spec
 */
@Component({
  selector: 'lab-configure-resource-view',
  templateUrl: './lab-configure-resource-view.component.html',
  styleUrls: ['./lab-configure-resource-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LabProcessDynamicFieldConfig },
  ],
  imports: [
    FlPortalModule,
    FlResizeModule,
    TdTechnicalDocModule,
    FlSectionModule,
    ReactiveFormsModule,
    MatButton,
    TranslatePipe,
  ],
})
export class LabConfigureResourceViewComponent implements OnInit {
  input: LabConfigureResourceViewInput = inject(FL_PORTAL_DATA);

  private overlayRef = inject(FlOverlayRef);
  private resourceService = inject(LabResourceService);
  private cdr = inject(ChangeDetectorRef);

  formGp: FormGroup<TdConfigureSpecsForm>;
  configs: TdConfig;

  isLoading: boolean = true;

  ngOnInit(): void {
    this.getViewSpecs();
  }

  private getViewSpecs(): void {
    let obs: Observable<LabResourceViewSpec>;

    // get the resource view specs from the resourceId if provided
    if (this.input.resourceId) {
      obs = this.resourceService.getResourceViewSpecsDetail(this.input.resourceId, this.input.viewMethodName);
    } else {
      // otherwise get it from the resource type
      obs = this.resourceService.getResourceTypeViewSpecsDetail(
        this.input.resourceTypingName,
        this.input.viewMethodName
      );
    }

    obs.subscribe({
      next: (specs) => this.init(specs),
      error: () => (this.isLoading = false),
    });
  }

  private init(specs: LabResourceViewSpec): void {
    this.configs = TdConfig.fromSpecs(specs.configSpecs, this.input.preConfiguration?.viewConfigValues ?? {});

    this.formGp = TdConfigureSpecsFormComponent.buildFormGroup(this.configs);

    this.isLoading = false;
    this.cdr.markForCheck();
  }

  submit(): void {
    if (this.formGp.valid) {
      const output = this.convertFormValueToResult();
      this.overlayRef.dispose(output);
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private convertFormValueToResult(): LabConfigureResourceViewOutput {
    return {
      viewMethodName: this.input.viewMethodName,
      viewConfigValues: TdConfigureSpecsFormComponent.buildValues(this.formGp),
    };
  }
}
