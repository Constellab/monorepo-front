import { Component, Inject } from '@angular/core';
import { FL_PORTAL_DATA, FlFormHelper, FlOverlayRef } from '@monorepo/front-core-lib';
import {
  labConvertTransformFormToParams,
  LabTransformerParams,
  LabTransformerWithConfig,
  LabTransformForm,
} from '../../../../model/global/lab-transformer.class';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { LabRouterService } from '../../../../service/lab-router.service';
import { LabTransformResourceComponent } from '../lab-transform-resource/lab-transform-resource.component';
import { FormBuilder } from '@angular/forms';

export interface LabTransformResourcePortalInput {
  resourceTypingName: string;
  resourceName: string;
  resourceId: string;
  // use to init form with transformers and config
  currentTransformers: LabTransformerWithConfig[];
}

/**
 * Dialog to transform a resource using transformers
 */
@Component({
    selector: 'lab-transform-resource-portal',
    templateUrl: './lab-transform-resource-portal.component.html',
    styleUrls: ['./lab-transform-resource-portal.component.scss'],
    standalone: false
})
export class LabTransformResourcePortalComponent {
  resourceTypingName: string;

  resourceName: string;

  formGp = new FormBuilder().group({
    transformers: LabTransformResourceComponent.buildFormArray(this.input.currentTransformers, 1),
  });
  isLoading: boolean = false;

  constructor(
    @Inject(FL_PORTAL_DATA) private input: LabTransformResourcePortalInput,
    private resourceService: LabResourceService,
    private overlayRef: FlOverlayRef,
    private routerService: LabRouterService
  ) {
    this.resourceTypingName = input.resourceTypingName;
    this.resourceName = input.resourceName;
  }

  submit(): void {
    if (this.formGp.valid && !this.isLoading) {
      this.callTransformer(this.formGp.getRawValue().transformers);
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private callTransformer(formValue: LabTransformForm[]): void {
    const transformers: LabTransformerParams[] = labConvertTransformFormToParams(formValue);
    this.isLoading = true;
    this.resourceService.transformResource(transformers, this.input.resourceId).subscribe({
      next: (scenario) => this.onTransformSuccess(scenario),
      error: () => (this.isLoading = false),
    });
  }

  private onTransformSuccess(resource: LabResource): void {
    this.isLoading = false;
    this.overlayRef.dispose();
    this.routerService.navigateToResourceDetail(resource.id);
  }
}
