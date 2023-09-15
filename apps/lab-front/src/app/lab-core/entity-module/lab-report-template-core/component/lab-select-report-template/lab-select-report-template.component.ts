import {Component, EventEmitter, Input, OnInit, Optional, Output, Self} from '@angular/core';
import {FlFormFieldDirective, FlInputSearchAdvancedButton} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';
import {LabReportTemplate, LabReportTemplateDatasource} from '../../../../model/entities/lab-report-template.entity';
import {LabReportTemplateService} from '../../../../entity-service/lab-report-template.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'lab-select-report-template',
  templateUrl: './lab-select-report-template.component.html',
  styleUrls: ['./lab-select-report-template.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabSelectReportTemplateComponent}]
})
export class LabSelectReportTemplateComponent extends FlFormFieldDirective<LabReportTemplate> implements OnInit {

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabReportTemplate> = new EventEmitter();

  selectedReportTemplate: LabReportTemplate | Observable<LabReportTemplate>;

  datasource: LabReportTemplateDatasource;

  advancedButton: FlInputSearchAdvancedButton<LabReportTemplate>;

  constructor(private reportTemplateService: LabReportTemplateService,
              @Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.reportTemplateService.searchByNameDatasource();
  }

  callChangeEvent(value: LabReportTemplate): void {
    this.valueChange.emit(value);
    this.selectedReportTemplate = value;
  }

  onDisableChange(): void {
  }

  writeValue(obj: LabReportTemplate): void {
    if (obj == null || (typeof obj != 'string' && obj.id == null)) {
      this.selectedReportTemplate = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedReportTemplate = this.reportTemplateService.getReportTemplate(obj);
    } else if (!(obj instanceof LabReportTemplate)) {
      this.selectedReportTemplate = this.reportTemplateService.getReportTemplate((obj as any).id);
    } else {
      // if the user is complete
      this.selectedReportTemplate = obj;
    }

    this.value = obj;
  }

}

