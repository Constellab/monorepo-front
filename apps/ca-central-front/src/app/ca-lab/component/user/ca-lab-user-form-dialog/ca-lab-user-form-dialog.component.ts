import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabUser, CaLabUserRole } from '../../../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LabUserFormDialogInput extends FlFormDialogInput<CaLabUserForm> {
  labId: string;
}

interface CaLabUserForm {
  user: CaUser;
  role: CaLabUserRole;
}

@Component({
  selector: 'ca-lab-user-form-dialog',
  templateUrl: './ca-lab-user-form-dialog.component.html',
  styleUrls: ['./ca-lab-user-form-dialog.component.scss'],
  standalone: false,
})
export class CaLabUserFormDialogComponent
  extends FlFormDialogAbstractDirective<CaLabUserForm, CaLabUser>
  implements OnInit
{
  private labService = inject(CaLabService);

  dialogInput: LabUserFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      //in update mode can't change user
      user: [{ value: null, disabled: this.isUpdateMode() }, Validators.required],
      role: ['USER', Validators.required],
    });
  }

  create(formValue: CaLabUserForm): Observable<CaLabUser> {
    return this.labService.addUserToLab(this.dialogInput.labId, formValue.user.id, formValue.role);
  }

  update(formValue: CaLabUserForm): Observable<CaLabUser> {
    return this.labService.updateUserLabRole(this.dialogInput.labId, formValue.user.id, formValue.role);
  }

  get title(): string {
    return this.isCreateMode() ? 'lab_user_create' : 'update_lab_user_role';
  }

  getCreateSuccessMessage(): string {
    return 'lab_user_created';
  }

  getUpdateSuccessMessage(): string {
    return 'lab_user_role_updated';
  }
}
