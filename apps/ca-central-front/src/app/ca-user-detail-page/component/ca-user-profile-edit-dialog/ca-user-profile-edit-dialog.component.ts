import { Component, inject, OnInit } from '@angular/core';
import { CaUser } from '../../../ca-core/model/entities/ca-user.class';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ca-user-profile-edit-dialog',
  templateUrl: './ca-user-profile-edit-dialog.component.html',
  styleUrls: ['./ca-user-profile-edit-dialog.component.scss']
})
export class CaUserProfileEditDialogComponent extends FlFormDialogAbstractDirective<Partial<CaUser>, CaUser>
  implements OnInit {

  dialogInput: FlFormDialogInput<CaUser> = inject(MAT_DIALOG_DATA);

  constructor(private authenticatedUserService: CaAuthenticatedUserService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      lastname: [null, Validators.required],
      firstname: [null, Validators.required],
      activity: [null],
      company: [null],
      phone: [null],
      biography: [null, Validators.max(500)],
    });
  }

  create(): Observable<CaUser> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'edit_profile_success';
  }

  update(formValue: Partial<CaUser>): Observable<CaUser> {
    return this.authenticatedUserService.editUser(formValue);
  }


}
