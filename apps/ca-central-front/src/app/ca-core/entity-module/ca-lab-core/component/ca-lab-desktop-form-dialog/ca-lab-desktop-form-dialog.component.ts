import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlPlatformService,
} from '@monorepo/front-core-lib';
import { CaLab } from '../../../../model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaLabDesktopForm } from '../../../../model/entities/lab/ca-lab.form';
import { Observable } from 'rxjs';

export type CaLabDesktopFormDialogInput = FlFormDialogInput<CaLabDesktopForm>;

@Component({
    selector: 'ca-lab-desktop-form-dialog',
    templateUrl: './ca-lab-desktop-form-dialog.component.html',
    styleUrl: './ca-lab-desktop-form-dialog.component.scss',
    standalone: false
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
