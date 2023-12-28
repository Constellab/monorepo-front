import {Component} from '@angular/core';
import {RvResourceViewDirective} from '@monorepo/resource-view';
import {LabResourceViewRichText} from '../../../../model/entities/resource/lab-resource-view.entity';
import {
  LabReportTextEditorConfig
} from '../../../../../lab-report/module/lab-report-detail-page/lab-report-text-editor-config.class';

@Component({
  selector: 'lab-resource-rich-text-view',
  templateUrl: './lab-resource-rich-text-view.component.html',
  styleUrls: ['./lab-resource-rich-text-view.component.scss'],
})
export class LabResourceRichTextViewComponent extends RvResourceViewDirective<LabResourceViewRichText> {

  textEditorConfig = new LabReportTextEditorConfig();

}
