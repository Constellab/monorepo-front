import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaUser } from '../../../ca-core/model/entities/ca-user.class';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';

@Component({
  selector: 'ca-user-profile-edit-dialog',
  templateUrl: './ca-user-profile-edit-dialog.component.html',
  styleUrls: ['./ca-user-profile-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaUserProfileEditDialogComponent
  extends FlFormDialogAbstractDirective<Partial<CaUser>, CaUser>
  implements OnInit
{
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  dialogInput: FlFormDialogInput<CaUser> = inject(MAT_DIALOG_DATA);

  constructor() {
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
