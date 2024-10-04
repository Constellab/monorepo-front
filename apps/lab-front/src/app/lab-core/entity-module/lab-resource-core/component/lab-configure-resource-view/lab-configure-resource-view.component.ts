import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  LabResourceViewSpec,
  LabResourceViewSpecWithConfig
} from '../../../../model/entities/resource/lab-resource-view.entity';
import { LabConfig, LabConfigureSpecsForm } from '../../../../model/entities/lab-config.entity';
import { FL_PORTAL_DATA, FlFormHelper, FlOverlayRef } from '@monorepo/front-core-lib';
import {
  LabConfigureSpecsFormComponent
} from '../../../lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { Observable } from 'rxjs';
import { PrConfigValues } from '@monorepo/protocol';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';

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


export interface LabConfigureResourceViewForm {
  viewConfig: LabConfigureSpecsForm;
}


/**
 * Portal to configure resource view spec
 */
@Component({
  selector: 'lab-configure-resource-view',
  templateUrl: './lab-configure-resource-view.component.html',
  styleUrls: ['./lab-configure-resource-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabConfigureResourceViewComponent implements OnInit {

  formGp: UntypedFormGroup;
  configs: LabConfig;

  title: string;
  resourceTypingName: string;
  viewStyle: TdTypeStyle;

  isLoading: boolean = true;

  constructor(@Inject(FL_PORTAL_DATA) private input: LabConfigureResourceViewInput,
              private overlayRef: FlOverlayRef,
              private resourceService: LabResourceService,
              private cdr: ChangeDetectorRef) {
    this.title = input.title;
    this.resourceTypingName = input.resourceTypingName;
    this.viewStyle = input.viewStyle;
  }

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
      obs = this.resourceService.getResourceTypeViewSpecsDetail(this.input.resourceTypingName, this.input.viewMethodName);
    }

    obs.subscribe({
      next: specs => this.init(specs),
      error: () => this.isLoading = false
    });
  }

  private init(specs: LabResourceViewSpec): void {
    this.configs = LabConfig.fromSpecs(specs.configSpecs, this.input.preConfiguration?.viewConfigValues ?? {});

    this.formGp = new FormBuilder().group({
      viewConfig: LabConfigureSpecsFormComponent.buildFormGroup(this.configs),
    });

    this.isLoading = false;
    this.cdr.markForCheck();
  }


  submit(): void {
    if (this.formGp.valid) {
      const output = this.convertFormValueToResult(this.formGp.getRawValue());
      this.overlayRef.dispose(output);
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private convertFormValueToResult(formValue: LabConfigureResourceViewForm): LabConfigureResourceViewOutput {

    return {
      viewMethodName: this.input.viewMethodName,
      viewConfigValues: {...formValue.viewConfig.public, ...formValue.viewConfig.protected},
    };
  }
}
