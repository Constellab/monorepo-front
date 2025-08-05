import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { CaLabUser, CaLabUserRole } from '../../../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

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
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FlFormModule,
    FlUserModule,
    MatError,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
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
