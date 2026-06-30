import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FL_PORTAL_DATA, FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import {
  labConvertTransformFormToParams,
  LiResource,
  LiResourceService,
  LiRouterService,
  LiTransformerParams,
  LiTransformerWithConfig,
  LiTransformForm,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiTransformResourceComponent } from '../li-transform-resource/li-transform-resource.component';

export interface LiTransformResourcePortalInput {
  resourceTypingName: string;
  resourceName: string;
  resourceId: string;
  // use to init form with transformers and config
  currentTransformers: LiTransformerWithConfig[];
}

/**
 * Dialog to transform a resource using transformers
 */
@Component({
  selector: 'li-transform-resource-portal',
  templateUrl: './li-transform-resource-portal.component.html',
  styleUrls: ['./li-transform-resource-portal.component.scss'],
  imports: [
    FlPortalModule,
    FlResizeModule,
    ReactiveFormsModule,
    LiTransformResourceComponent,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LiTransformResourcePortalComponent {
  private input = inject<LiTransformResourcePortalInput>(FL_PORTAL_DATA);
  private resourceService = inject(LiResourceService);
  private overlayRef = inject(FlOverlayRef);
  private routerService = inject(LiRouterService);

  resourceTypingName: string;

  resourceName: string;

  formGp = new FormBuilder().group({
    transformers: LiTransformResourceComponent.buildFormArray(this.input.currentTransformers, 1),
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

  private callTransformer(formValue: LiTransformForm[]): void {
    const transformers: LiTransformerParams[] = labConvertTransformFormToParams(formValue);
    this.isLoading = true;
    this.resourceService.transformResource(transformers, this.input.resourceId).subscribe({
      next: (resource) => this.onTransformSuccess(resource),
      error: () => (this.isLoading = false),
    });
  }

  private onTransformSuccess(resource: LiResource): void {
    this.isLoading = false;
    this.overlayRef.dispose();
    this.routerService.navigateToResourceDetail(resource.id);
  }
}
