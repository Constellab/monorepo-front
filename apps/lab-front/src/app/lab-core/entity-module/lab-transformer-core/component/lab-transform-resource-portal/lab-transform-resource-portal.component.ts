import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlPortalModule,
    FlResizeModule,
    ReactiveFormsModule,
    LabTransformResourceComponent,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LabTransformResourcePortalComponent {
  private input = inject<LabTransformResourcePortalInput>(FL_PORTAL_DATA);
  private resourceService = inject(LabResourceService);
  private overlayRef = inject(FlOverlayRef);
  private routerService = inject(LabRouterService);

  resourceTypingName: string;

  resourceName: string;

  formGp = new FormBuilder().group({
    transformers: LabTransformResourceComponent.buildFormArray(this.input.currentTransformers, 1),
  });
  isLoading: boolean = false;

  constructor() {
    const input = this.input;

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
