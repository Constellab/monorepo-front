import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CaLab, CaLabWithSpace } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaLabCloudCreateDTO } from '../../../../ca-core/model/entities/lab/ca-lab.form';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabSelectServerComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-server/ca-lab-select-server.component';
import { LmlLabManagerConfig } from '@monorepo/lab-manager-lib';
import { CaLabSelectStorageComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-storage/ca-lab-select-storage.component';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import {
  MatStepper,
  MatStep,
  MatStepLabel,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { CaLabCreateSummaryComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-create-summary/ca-lab-create-summary.component';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-create-page',
  templateUrl: './ca-lab-create-page.component.html',
  styleUrl: './ca-lab-create-page.component.scss',
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
    const createLab: CaLabCloudCreateDTO = {
      name: this.nameForm.get('name').value,
      serverCloud: this.serverForm.get('serverCloud').value,
      region: this.serverForm.get('region').value,
      volumeSize: this.storageForm.get('storageSize').value,
      labConfig: this.labConfig,
      dailyBackupRegion: this.serverForm.get('dailyBackupRegion').value,
      weeklyBackupRegion: this.serverForm.get('weeklyBackupRegion').value,
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
