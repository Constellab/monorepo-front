import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CaSpaceSettingsDto} from '../../../../model/entities/space/ca-space.dto';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CaSpaceService} from '../../../../service-api/ca-space.service';
import {FlSnackBarService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-space-license-form-dialog',
  templateUrl: './ca-space-license-form-dialog.component.html',
  styleUrl: './ca-space-license-form-dialog.component.scss'
})
export class CaSpaceLicenseFormDialogComponent {

  formCtrl = new FormControl(0, Validators.required);

  isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) nbOfLicenses: number,
              private spaceService: CaSpaceService,
              private dialogRef: MatDialogRef<CaSpaceLicenseFormDialogComponent>,
              private snackBarService: FlSnackBarService) {
    this.formCtrl.setValue(nbOfLicenses);
  }

  submit():void {
    if(!this.isLoading && this.formCtrl.valid){
      this.updateLicenses(this.formCtrl.value);
    }
  }

  private updateLicenses(nbOfLicenses: number): void{
    this.spaceService.updateNbLicenses(nbOfLicenses).subscribe({
      next: (space: CaSpaceSettingsDto) => this.onUpdateSuccess(space),
      error: () => this.isLoading = false
    });
  }

  private onUpdateSuccess(space: CaSpaceSettingsDto): void{
    this.isLoading = false;
    this.snackBarService.openSuccessMessage({
      text: 'space_license_updated',
      translateText: true
    })
    this.dialogRef.close(space);
  }
}
