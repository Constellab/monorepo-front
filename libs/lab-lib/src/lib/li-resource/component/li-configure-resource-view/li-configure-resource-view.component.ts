import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LiProcessDynamicFieldConfig } from '@monorepo/lab-lib/li-config';
import {
  LiResourceService,
  LiResourceViewSpec,
  LiResourceViewSpecWithConfig,
} from '@monorepo/lab-lib/li-core';
import { MatButton } from '@angular/material/button';
import { Observable } from 'rxjs';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdParamSpecsValues,
  TdTechnicalDocModule,
  TdTypeStyle,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiConfigureResourceViewInput {
  resourceTypingName: string;
  resourceId?: string;
  title: string;
  viewMethodName: string;
  viewStyle: TdTypeStyle;

  preConfiguration?: LiResourceViewSpecWithConfig;
}

export interface LiConfigureResourceViewOutput {
  viewMethodName: string;
  viewConfigValues: TdParamSpecsValues;
}

/**
 * Portal to configure resource view spec
 */
@Component({
  selector: 'li-configure-resource-view',
  templateUrl: './li-configure-resource-view.component.html',
  styleUrls: ['./li-configure-resource-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LiProcessDynamicFieldConfig },
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
export class LiConfigureResourceViewComponent implements OnInit {
  input: LiConfigureResourceViewInput = inject(FL_PORTAL_DATA);

  private overlayRef = inject(FlOverlayRef);
  private resourceService = inject(LiResourceService);
  private cdr = inject(ChangeDetectorRef);

  formGp: FormGroup<TdConfigureSpecsForm>;
  configs: TdConfig;

  isLoading: boolean = true;

  ngOnInit(): void {
    this.getViewSpecs();
  }

  private getViewSpecs(): void {
    let obs: Observable<LiResourceViewSpec>;

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

  private init(specs: LiResourceViewSpec): void {
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

  private convertFormValueToResult(): LiConfigureResourceViewOutput {
    return {
      viewMethodName: this.input.viewMethodName,
      viewConfigValues: TdConfigureSpecsFormComponent.buildValues(this.formGp),
    };
  }
}
