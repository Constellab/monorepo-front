import {Component, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {LabReportTemplate, LabReportTemplateForm} from '../../../../model/entities/lab-report-template.entity';
import {LabReportTemplateService} from '../../../../entity-service/lab-report-template.service';

@Component({
  selector: 'lab-report-template-form-dialog',
  templateUrl: './lab-report-template-form-dialog.component.html',
  styleUrl: './lab-report-template-form-dialog.component.scss',
})
export class LabReportTemplateFormDialogComponent extends FlFormDialogAbstractDirective<LabReportTemplateForm, LabReportTemplate>
  implements OnInit {

  constructor(private reportTemplateService: LabReportTemplateService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_report_template' : '';
  }

  buildForm(): FormGroup<LabReportTemplateForm> {
    return new FormBuilder().group({
      title: [null, Validators.required],
    });
  }

  create(formValue: LabReportTemplateForm): Observable<LabReportTemplate> {
    return this.reportTemplateService.createEmpty(formValue);
  }

  update(): Observable<LabReportTemplate> {
    throw new Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'biox.report_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
