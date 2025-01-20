import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CaLab, CaLabWithSpace } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaLabCloudCreateDTO } from '../../../../ca-core/model/entities/lab/ca-lab.form';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabSelectServerComponent,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-server/ca-lab-select-server.component';
import { LmlLabManagerConfig } from '@monorepo/lab-manager-lib';
import {
  CaLabSelectStorageComponent
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-storage/ca-lab-select-storage.component';

@Component({
    selector: 'ca-lab-create-page',
    templateUrl: './ca-lab-create-page.component.html',
    styleUrl: './ca-lab-create-page.component.scss',
    standalone: false
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
