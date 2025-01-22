import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { LabProtocolService } from '../../../../lab-core/entity-service/lab-protocol.service';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CoCommunityLibModule } from '../../../../../../../../libs/community-lib/src/lib/co-community-lib.module';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export type LabProcessEditStyleDialogInputData = FlFormDialogInput<LabProcess>;

export interface LabProcessEditStyleFormData {
  style: TdTypeStyle;
}

@Component({
  selector: 'lab-process-edit-style-dialog',
  templateUrl: './lab-process-edit-style-dialog.component.html',
  styleUrl: './lab-process-edit-style-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    CoCommunityLibModule,
    MatButton,
    TranslatePipe,
  ],
})
export class LabProcessEditStyleDialogComponent
  extends FlFormDialogAbstractDirective<LabProcessEditStyleFormData, LabProcess>
  implements OnInit
{
  private protocolService = inject(LabProtocolService);

  process: LabProcess;

  constructor() {
    const data = inject<LabProcessEditStyleDialogInputData>(MAT_DIALOG_DATA);

    super();
    this.process = data.object;
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      style: [this.process.style, Validators.required],
    });
  }

  create(formValue: LabProcessEditStyleFormData): Observable<LabProcess> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.process_style_updated';
  }

  update(formValue: LabProcessEditStyleFormData): Observable<LabProcess> {
    return this.protocolService.updateStyle(
      this.process.parentProtocolId,
      this.process.instanceName,
      formValue.style
    );
  }
}
