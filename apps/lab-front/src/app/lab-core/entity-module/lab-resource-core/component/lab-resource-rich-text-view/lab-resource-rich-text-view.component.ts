import { Component, OnInit } from '@angular/core';
import { RvResourceViewDirective } from '@monorepo/resource-view';
import { LabResourceViewRichText } from '../../../../model/entities/resource/lab-resource-view.entity';
import {
  LabReportTextEditorConfig
} from '../../../../../lab-report/module/lab-report-detail-page/lab-report-text-editor-config.class';
import { LabEnoteTextEditorConfig } from '../../model/lab-enote-text-editor.config';
import { TeConfig } from '@monorepo/text-editor';

@Component({
  selector: 'lab-resource-rich-text-view',
  templateUrl: './lab-resource-rich-text-view.component.html',
  styleUrls: ['./lab-resource-rich-text-view.component.scss']
})
export class LabResourceRichTextViewComponent
  extends RvResourceViewDirective<LabResourceViewRichText> implements OnInit {

  textEditorConfig: TeConfig;

  ngOnInit(): void {
    if (this.view.data.report_id) {
      this.textEditorConfig = new LabReportTextEditorConfig(this.view.data.report_id);
    } else {
      this.textEditorConfig = new LabEnoteTextEditorConfig(this.resourceId);
    }
  }
}
