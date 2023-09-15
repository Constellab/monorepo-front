import {Component, EventEmitter, Input, OnInit, Optional, Output, Self} from '@angular/core';
import {FlDialogService, FlFormFieldDirective, FlInputSearchAdvancedButton} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';
import {LabReport, LabReportDatasource} from '../../../../model/entities/lab-report.entity';
import {LabReportService} from '../../../../entity-service/lab-report.service';
import {LabSelectReportDialogComponent} from '../lab-select-report-dialog/lab-select-report-dialog.component';

@Component({
  selector: 'lab-select-report',
  templateUrl: './lab-select-report.component.html',
  styleUrls: ['./lab-select-report.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabSelectReportComponent}]
})
export class LabSelectReportComponent extends FlFormFieldDirective<LabReport> implements OnInit {

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabReport> = new EventEmitter();

  selectedReport: LabReport;

  datasource: LabReportDatasource;

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
    if (obj == null || obj.id == null) {
      this.selectedReport = null;
      this.value = null;
      return;
    }
    // if the user is complete
    this.selectedReport = obj;

    this.value = obj;
  }

}
