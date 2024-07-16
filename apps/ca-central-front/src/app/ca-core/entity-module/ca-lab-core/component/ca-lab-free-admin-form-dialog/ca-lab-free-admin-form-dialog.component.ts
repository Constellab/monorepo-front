import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { CaLabInstanceWithSpace } from '../../../../model/entities/lab/ca-lab-instance.class';
import { CaLabInstanceService } from '../../../../service-api/ca-lab-instance.service';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
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
export class CaLabFreeAdminFormDialogComponent extends FlFormDialogAbstractDirective<CaLabFreeCreateDto, CaLabInstanceWithSpace>
  implements OnInit {


  constructor(private labInstanceService: CaLabInstanceService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaLabFreeCreateDto> {
    return new FormBuilder().group({
      user: [null, Validators.required],
      space: [null, Validators.required]
    });
  }

  create(formValue: CaLabFreeCreateDto): Observable<CaLabInstanceWithSpace> {
    return this.labInstanceService.createFreeLab(formValue);
  }

  update(): Observable<CaLabInstanceWithSpace> {
    throw Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'lab_free_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
