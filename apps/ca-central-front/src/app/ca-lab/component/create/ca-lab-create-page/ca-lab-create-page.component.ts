import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CaLab, CaLabWithSpace } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaServerService } from '../../../../ca-core/service-api/ca-server.service';
import { Observable, share } from 'rxjs';
import { FlGlobalValidators, FlSnackBarService } from '@monorepo/front-core-lib';
import { CaLabManagerConfig } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { TdBrick } from '@monorepo/technical-doc';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaLabCloudCreateDTO } from '../../../../ca-core/model/entities/lab/ca-lab.form';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabSelectServerComponent } from '../ca-lab-select-server/ca-lab-select-server.component';

@Component({
  selector: 'ca-lab-create-page',
  templateUrl: './ca-lab-create-page.component.html',
  styleUrl: './ca-lab-create-page.component.scss'
})
export class CaLabCreatePageComponent {

  nameForm = this._formBuilder.group({
    name: ['', Validators.required],
  });

  storageForm = this._formBuilder.group({
    storageSize: [100, [Validators.required, FlGlobalValidators.isInteger, Validators.min(100)]],
  });

  serverForm = CaLabSelectServerComponent.createFormGp();

  labConfig: CaLabManagerConfig;

  maxNameLength = CaLabWithSpace.MAX_NAME_LENGTH;

  readonly MIN_STORAGE_SIZE = 100;
  readonly MAX_STORAGE_SIZE = 4000;

  storagePrice$: Observable<number> = this.serverService.getStorageCurrentPrice().pipe(share());

  createIsLoading: boolean = false;

  constructor(private _formBuilder: FormBuilder,
              private serverService: CaServerService,
              private routerService: CaRouterService,
              private snackBarService: FlSnackBarService,
              private labService: CaLabService) {
    const labConfig = new CaLabManagerConfig();
    labConfig.brickVersions = [{name: TdBrick.GWS_CORE, version: '0.8.0-beta.1'}];
    labConfig.glabTag = null;
    this.labConfig = labConfig;
  }


  reduceStorageSize(): void {
    let storagePrice = this.storageForm.get('storageSize').value;
    if (storagePrice <= this.MIN_STORAGE_SIZE) {
      return;
    } else if (storagePrice <= 1000) {
      storagePrice -= 50;
    } else {
      storagePrice -= 100;
    }
    this.storageForm.get('storageSize').setValue(storagePrice);
  }

  increaseStorageSize(): void {
    let storagePrice = this.storageForm.get('storageSize').value;
    if (storagePrice >= this.MAX_STORAGE_SIZE) {
      return;
    } else if (storagePrice >= 1000) {
      storagePrice += 100;
    } else {
      storagePrice += 50;
    }
    this.storageForm.get('storageSize').setValue(storagePrice);
  }

  labConfigIsValid(): boolean {
    return this.labConfig?.brickVersions.length > 0 &&
      this.labConfig.brickVersions.find(brickVersion => brickVersion.name === TdBrick.GWS_CORE) !== null;
  }

  createLab(): void {
    const createLab: CaLabCloudCreateDTO = {
      name: this.nameForm.get('name').value,
      serverCloud: this.serverForm.get('serverCloud').value,
      region: this.serverForm.get('region').value,
      volumeSize: this.storageForm.get('storageSize').value,
      labConfig: this.labConfig,
      dailyBackupRegion: this.serverForm.get('dailyBackupRegion').value,
      weeklyBackupRegion: this.serverForm.get('weeklyBackupRegion').value
    };

    this.createIsLoading = true;
    this.labService.createCloudLab(createLab).subscribe({
      next: lab => this.createLabSuccess(lab),
      error: () => this.createIsLoading = false
    });
  }

  private createLabSuccess(lab: CaLab): void {
    this.createIsLoading = false;
    this.snackBarService.openSuccessMessage({
      text: 'cloud_lab_created_success',
      translateText: true
    }, 10000);

    this.routerService.navigateToLabDetail(lab.id);
  }



}
