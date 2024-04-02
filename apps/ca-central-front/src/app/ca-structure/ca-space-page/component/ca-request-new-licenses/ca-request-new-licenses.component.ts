import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {CaSpaceService} from '../../../../ca-core/service-api/ca-space.service';
import {FlSnackBarService} from '@monorepo/front-core-lib';
import {Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CaRequestNewLicensesDto} from '../../../../ca-core/model/entities/space/ca-space.dto';

@Component({
  selector: 'ca-request-new-licenses',
  templateUrl: './ca-request-new-licenses.component.html',
  styleUrls: ['./ca-request-new-licenses.component.scss']
})
export class CaRequestNewLicensesComponent implements OnInit {

  isLoading: boolean = false;

  formGroup: FormGroup<CaRequestNewLicensesDto>;

  constructor(private dialogRef: MatDialogRef<CaRequestNewLicensesComponent>,
              private spaceService: CaSpaceService,
              private snackBarService: FlSnackBarService) {
  }

  ngOnInit(): void {
    this.formGroup = new FormBuilder().group({
      nbLicenses: [0, Validators.required],
      text: '',
    });
  }

  submit(): void {
    if (!this.isLoading && this.formGroup.valid) {
      this.sendRequest(this.formGroup.getRawValue());
    }
  }

  private sendRequest(request: CaRequestNewLicensesDto): void {
    this.isLoading = true;
    this.spaceService.requestNewLicenses(request).subscribe({
      next: () => this.onSuccess(),
      error: () => this.isLoading = false
    });
  }

  private onSuccess(): void {
    this.snackBarService.openSuccessMessage({text: 'new_licenses_requested', translateText: true});
    this.isLoading = false;
    this.dialogRef.close();
  }

}
