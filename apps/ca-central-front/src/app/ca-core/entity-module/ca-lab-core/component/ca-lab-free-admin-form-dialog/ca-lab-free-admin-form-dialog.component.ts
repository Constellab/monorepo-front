import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { CaLabWithSpace } from '../../../../model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaLabFreeCreateDto } from '../../../../model/entities/lab/ca-lab-free.class';

/**
 * Admin form to create a free lab
 */
@Component({
  selector: 'ca-lab-free-admin-form-dialog',
  templateUrl: './ca-lab-free-admin-form-dialog.component.html',
  styleUrl: './ca-lab-free-admin-form-dialog.component.scss'
})
export class CaLabFreeAdminFormDialogComponent extends FlFormDialogAbstractDirective<CaLabFreeCreateDto, CaLabWithSpace>
  implements OnInit {


  constructor(private labService: CaLabService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      user: [null, Validators.required],
      space: [null, Validators.required]
    });
  }

  create(formValue: CaLabFreeCreateDto): Observable<CaLabWithSpace> {
    return this.labService.createFreeLab(formValue);
  }

  update(): Observable<CaLabWithSpace> {
    throw Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'lab_free_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
