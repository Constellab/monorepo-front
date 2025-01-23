import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  LabResourceViewSpec,
  LabResourceViewSpecWithConfig,
} from '../../../../model/entities/resource/lab-resource-view.entity';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import { FL_PORTAL_DATA, FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';

import {
  LabConfigureSpecsForm,
  LabConfigureSpecsFormComponent,
} from '../../../lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { Observable } from 'rxjs';
import { PrConfigValues } from '@monorepo/protocol';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabProcessDynamicFieldConfig } from '../../../lab-config-core/lab-process-dynamic-field-config.service';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
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
  viewConfigValues: PrConfigValues;
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
    LabConfigureSpecsFormComponent,
    MatButton,
    TranslatePipe,
  ],
})
export class LabConfigureResourceViewComponent implements OnInit {
  input: LabConfigureResourceViewInput = inject(FL_PORTAL_DATA);

  private overlayRef = inject(FlOverlayRef);
  private resourceService = inject(LabResourceService);
  private cdr = inject(ChangeDetectorRef);

  formGp: FormGroup<LabConfigureSpecsForm>;
  configs: LabConfig;

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
    this.configs = LabConfig.fromSpecs(
      specs.configSpecs,
      this.input.preConfiguration?.viewConfigValues ?? {}
    );

    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(this.configs);

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
      viewConfigValues: LabConfigureSpecsFormComponent.buildValues(this.formGp),
    };
  }
}
