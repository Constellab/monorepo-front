import { Component, inject, OnInit } from '@angular/core';
import { CaUser } from '../../../ca-core/model/entities/ca-user.class';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-user-profile-edit-dialog',
  templateUrl: './ca-user-profile-edit-dialog.component.html',
  styleUrls: ['./ca-user-profile-edit-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
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
