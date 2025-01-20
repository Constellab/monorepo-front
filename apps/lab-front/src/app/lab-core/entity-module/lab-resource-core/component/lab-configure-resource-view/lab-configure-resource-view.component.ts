import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  LabResourceViewSpec,
  LabResourceViewSpecWithConfig,
} from '../../../../model/entities/resource/lab-resource-view.entity';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import {
  FL_PORTAL_DATA,
  FlDynamicFieldConfigService,
  FlFormHelper,
  FlOverlayRef,
} from '@monorepo/front-core-lib';
import {
  LabConfigureSpecsForm,
  LabConfigureSpecsFormComponent,
} from '../../../lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { Observable } from 'rxjs';
import { PrConfigValues } from '@monorepo/protocol';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { FormGroup } from '@angular/forms';
import { LabProcessDynamicFieldConfig } from '../../../lab-config-core/lab-process-dynamic-field-config.service';

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
    standalone: false
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
