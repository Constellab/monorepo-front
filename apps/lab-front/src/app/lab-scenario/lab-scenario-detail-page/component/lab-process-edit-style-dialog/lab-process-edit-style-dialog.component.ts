import { Component, Inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabProtocolService } from '../../../../lab-core/entity-service/lab-protocol.service';

export type LabProcessEditStyleDialogInputData = FlFormDialogInput<LabProcess>;

@Component({
  selector: 'lab-process-edit-style-dialog',
  templateUrl: './lab-process-edit-style-dialog.component.html',
  styleUrl: './lab-process-edit-style-dialog.component.scss'
})
export class LabProcessEditStyleDialogComponent extends FlFormDialogAbstractDirective<TdTypeStyle, LabProcess>
  implements OnInit{

  process: LabProcess;

  constructor(@Inject(MAT_DIALOG_DATA) data: LabProcessEditStyleDialogInputData,
              private protocolService: LabProtocolService) {
    super();
    this.process = data.object;
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      icon_type: [this.process.style.icon_type, Validators.required],
      icon_color: [this.process.style.icon_color, Validators.required],
      icon_technical_name: [
        this.process.style.icon_technical_name,
        [Validators.required],
      ],
      background_color: [this.process.style.background_color, Validators.required]
    });
  }

  create(formValue: TdTypeStyle): Observable<LabProcess> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.process_style_updated';
  }

  update(formValue: TdTypeStyle): Observable<LabProcess> {
    return this.protocolService.updateStyle(this.process.parentProtocolId, this.process.instanceName, formValue);
  }
}
