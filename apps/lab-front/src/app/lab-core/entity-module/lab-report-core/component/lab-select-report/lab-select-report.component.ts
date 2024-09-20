import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDialogService,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter
} from '@monorepo/front-core-lib';
import { NgControl } from '@angular/forms';
import { LabReport, LabReportDatasource } from '../../../../model/entities/lab-report.entity';
import { LabReportService } from '../../../../entity-service/lab-report.service';
import { LabSelectReportDialogComponent } from '../lab-select-report-dialog/lab-select-report-dialog.component';
import { LabDocumentTemplate } from '../../../../model/entities/lab-document-template.entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'lab-select-report',
  templateUrl: './lab-select-report.component.html',
  styleUrls: ['./lab-select-report.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectReportComponent }]
})
export class LabSelectReportComponent extends FlFormFieldDirective<LabReport> implements OnInit {

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabReport> = new EventEmitter();

  selectedReport: LabReport | Observable<LabReport>;

  datasource: LabReportDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabReport>;

  constructor(private reportService: LabReportService,
              private dialogService: FlDialogService,
              @Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.reportService.searchByNameDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectReportDialogComponent).afterClosed()
    };
  }

  callChangeEvent(value: LabReport): void {
    this.valueChange.emit(value);
    this.selectedReport = value;
  }

  onDisableChange(): void {
  }

  writeValue(obj: LabReport): void {
    if (obj == null || (typeof obj != 'string' && obj.id == null)) {
      this.selectedReport = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedReport = this.reportService.getReport(obj);
    } else if (!(obj instanceof LabDocumentTemplate)) {
      this.selectedReport = this.reportService.getReport((obj as any).id);
    } else {
      // if the user is complete
      this.selectedReport = obj;
    }

    this.value = obj;
  }

}
