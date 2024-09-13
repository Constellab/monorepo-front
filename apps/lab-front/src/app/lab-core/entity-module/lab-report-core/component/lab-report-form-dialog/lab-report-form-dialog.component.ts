import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { LabReport, LabReportForm } from '../../../../model/entities/lab-report.entity';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { LabReportService } from '../../../../entity-service/lab-report.service';
import { LabEntity } from '../../../../model/global/lab-entity.entity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabDocumentTemplate } from '../../../../model/entities/lab-document-template.entity';

export interface LabReportFormDialogInput extends FlFormDialogInput<LabReportForm> {
  reportId?: string;
  experimentId?: string; // can be provided during create to link the report directly to an experiment
  folder?: LabEntity;
  disableFolder?: boolean;
}

@Component({
  selector: 'lab-report-form-dialog',
  templateUrl: './lab-report-form-dialog.component.html',
  styleUrls: ['./lab-report-form-dialog.component.scss']
})
export class LabReportFormDialogComponent extends FlFormDialogAbstractDirective<LabReportForm, LabReport> implements OnInit {

  dialogInput: LabReportFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor(private reportService: LabReportService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_report' : 'biox.update_report';
  }

  buildForm(): FormGroup<LabReportForm> {
    const formGroup: FormGroup<LabReportForm> = new FormBuilder().group({
      title: [null, Validators.required],
      folder: [{value: this.dialogInput.folder, disabled: this.isCreateMode() && this.dialogInput.folder != null}],
      template: [{value: null, disabled: this.isUpdateMode()}]
    });

    if (this.dialogInput.disableFolder) {
      formGroup.get('folder').disable();
    }

    return formGroup;
  }

  create(formValue: LabReportForm): Observable<LabReport> {
    if (this.dialogInput.experimentId) {
      return this.reportService.createForExperiment(formValue, this.dialogInput.experimentId);
    } else {
      return this.reportService.create(formValue);
    }
  }

  update(formValue: LabReportForm): Observable<LabReport> {
    return this.reportService.update(this.dialogInput.reportId, formValue);
  }

  getCreateSuccessMessage(): string {
    return 'biox.report_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.report_updated';
  }

  onTemplateSelected(template: LabDocumentTemplate): void {
    if (!this.formGp.value.title) {
      this.formGp.patchValue({title: template.title});
    }
  }


}
