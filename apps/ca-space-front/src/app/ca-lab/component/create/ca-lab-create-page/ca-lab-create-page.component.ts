import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LmlLabManagerConfig } from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabCreateSummaryComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-create-summary/ca-lab-create-summary.component';
import { CaLabSelectServerComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-server/ca-lab-select-server.component';
import { CaLabSelectStorageComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-storage/ca-lab-select-storage.component';
import { CaLab, CaLabWithSpace } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabCloudCreateDTO } from '../../../../ca-core/model/entities/lab/ca-lab.form';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

@Component({
  selector: 'ca-lab-create-page',
  templateUrl: './ca-lab-create-page.component.html',
  styleUrl: './ca-lab-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatStepLabel,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatButton,
    MatStepperNext,
    CaLabSelectServerComponent,
    MatStepperPrevious,
    CaLabSelectStorageComponent,
    CaLabCreateSummaryComponent,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabCreatePageComponent {
  private _formBuilder = inject(FormBuilder);
  private routerService = inject(CaRouterService);
  private snackBarService = inject(FlSnackBarService);
  private labService = inject(CaLabService);

  nameForm = this._formBuilder.group({
    name: ['', Validators.required],
  });

  storageForm = CaLabSelectStorageComponent.createFormGp();

  serverForm = CaLabSelectServerComponent.createFormGp();

  labConfig: LmlLabManagerConfig;

  maxNameLength = CaLabWithSpace.MAX_NAME_LENGTH;

  createIsLoading: boolean = false;

  // labConfigIsValid(): boolean {
  //   return (
  //     this.labConfig?.brickVersions.length > 0 &&
  //     this.labConfig.brickVersions.find((brickVersion) => brickVersion.name === TdBrick.GWS_CORE) !== null
  //   );
  // }

  createLab(): void {
    // the stepper is linear with each step bound to its form via [stepControl], so by the time
    // this last step is reached, nameForm/serverForm/storageForm are all valid and these fields
    // are set.
    const name = this.nameForm.controls.name.value;
    const volumeSize = this.storageForm.controls.storageSize.value;
    const { serverCloud, region, dailyBackupRegion, weeklyBackupRegion } = this.serverForm.getRawValue();
    if (
      name == null ||
      serverCloud == null ||
      region == null ||
      volumeSize == null ||
      dailyBackupRegion == null ||
      weeklyBackupRegion == null
    ) {
      throw new Error('CaLabCreatePageComponent: missing form value at lab creation');
    }

    const createLab: CaLabCloudCreateDTO = {
      name,
      serverCloud,
      region,
      volumeSize,
      labConfig: this.labConfig,
      dailyBackupRegion,
      weeklyBackupRegion,
    };

    this.createIsLoading = true;
    this.labService.createCloudLab(createLab).subscribe({
      next: (lab) => this.createLabSuccess(lab),
      error: () => (this.createIsLoading = false),
    });
  }

  private createLabSuccess(lab: CaLab): void {
    this.createIsLoading = false;
    this.snackBarService.openSuccessMessage(
      {
        text: 'cloud_lab_created_success',
        translateText: true,
      },
      10000
    );

    this.routerService.navigateToLabDetail(lab.id);
  }
}
