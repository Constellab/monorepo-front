import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput, FlPlatformService } from '@monorepo/front-core-lib/fl-core';

import { CaLab } from '../../../../model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaLabDesktopForm } from '../../../../model/entities/lab/ca-lab.form';
import { Observable } from 'rxjs';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export type CaLabDesktopFormDialogInput = FlFormDialogInput<CaLabDesktopForm>;

@Component({
  selector: 'ca-lab-desktop-form-dialog',
  templateUrl: './ca-lab-desktop-form-dialog.component.html',
  styleUrl: './ca-lab-desktop-form-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatRadioGroup,
    MatRadioButton,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabDesktopFormDialogComponent
  extends FlFormDialogAbstractDirective<CaLabDesktopForm, CaLab>
  implements OnInit
{
  private platformService = inject(FlPlatformService);
  private labService = inject(CaLabService);

  maxNameLength = CaLab.MAX_NAME_LENGTH;

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'create_lab' : 'update_lab';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      name: [null as string, [Validators.required]],
      desktopPlatform: [this.platformService.isSafari() ? 'MAC' : 'WINDOWS', [Validators.required]],
    });
  }

  create(formValue: CaLabDesktopForm): Observable<CaLab> {
    return this.labService.createDesktopLab(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'lab_created';
  }

  getUpdateSuccessMessage(): string {
    return 'lab_updated';
  }

  update(formValue: CaLabDesktopForm): Observable<CaLab> {
    return this.labService.updateLabDesktop(formValue);
  }
}
