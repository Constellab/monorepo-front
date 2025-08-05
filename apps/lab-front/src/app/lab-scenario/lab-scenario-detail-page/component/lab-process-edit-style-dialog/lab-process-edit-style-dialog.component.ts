import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { LiProcess, LiProtocolService } from '@monorepo/lab-lib/li-core';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export type LabProcessEditStyleDialogInputData = FlFormDialogInput<LiProcess>;

export interface LabProcessEditStyleFormData {
  style: TdTypeStyle;
}

@Component({
  selector: 'lab-process-edit-style-dialog',
  templateUrl: './lab-process-edit-style-dialog.component.html',
  styleUrl: './lab-process-edit-style-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    CoCommunityLibModule,
    MatButton,
    TranslatePipe,
  ],
})
export class LabProcessEditStyleDialogComponent
  extends FlFormDialogAbstractDirective<LabProcessEditStyleFormData, LiProcess>
  implements OnInit
{
  private protocolService = inject(LiProtocolService);

  process: LiProcess;

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

  create(): Observable<LiProcess> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.process_style_updated';
  }

  update(formValue: LabProcessEditStyleFormData): Observable<LiProcess> {
    return this.protocolService.updateStyle(
      this.process.parentProtocolId,
      this.process.instanceName,
      formValue.style
    );
  }
}
