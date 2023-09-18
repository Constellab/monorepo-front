import {Component} from '@angular/core';
import {RvResourceViewDirective} from '@monorepo/resource-view';
import {LabResourceViewRichText} from '../../../../model/entities/resource/lab-resource-view.entity';
import {FlDialogService, FlTextEditorConfig} from '@monorepo/front-core-lib';
import {LabReportService} from '../../../../entity-service/lab-report.service';
import {
  LabReportTextEditorConfig
} from '../../../../../lab-report/module/lab-report-detail-page/lab-report-text-editor-config.class';

@Component({
  selector: 'lab-resource-rich-text-view',
  templateUrl: './lab-resource-rich-text-view.component.html',
  styleUrls: ['./lab-resource-rich-text-view.component.scss'],
})
export class LabResourceRichTextViewComponent extends RvResourceViewDirective<LabResourceViewRichText> {

  textEditorConfig: FlTextEditorConfig= new LabReportTextEditorConfig(this.reportService, this.dialogService);


  constructor(private reportService: LabReportService,
              private dialogService: FlDialogService) {
    super();
  }
}
