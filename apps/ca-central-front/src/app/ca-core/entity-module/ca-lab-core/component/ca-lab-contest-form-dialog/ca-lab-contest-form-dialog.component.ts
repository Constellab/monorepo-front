import {Component, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective} from '@monorepo/front-core-lib';
import {CaLabContestForm} from '../../../../model/entities/lab/ca-lab-instance.form';
import {CaLabInstanceWithSpace} from '../../../../model/entities/lab/ca-lab-instance.class';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';

/**
 * Admin form to create a lab for the Constellab contest
 */
@Component({
  selector: 'ca-lab-contest-form-dialog',
  templateUrl: './ca-lab-contest-form-dialog.component.html',
  styleUrl: './ca-lab-contest-form-dialog.component.scss'
})
export class CaLabContestFormDialogComponent extends FlFormDialogAbstractDirective<CaLabContestForm, CaLabInstanceWithSpace>
  implements OnInit {


  constructor(private labInstanceService: CaLabInstanceService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaLabContestForm> {
    return new FormBuilder().group({
      user: [null, Validators.required],
      space: [null, Validators.required],
    });
  }

  create(formValue: CaLabContestForm): Observable<CaLabInstanceWithSpace> {
    return this.labInstanceService.createContestLab(formValue);
  }

  update(): Observable<CaLabInstanceWithSpace> {
    throw Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'lab_contest_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
