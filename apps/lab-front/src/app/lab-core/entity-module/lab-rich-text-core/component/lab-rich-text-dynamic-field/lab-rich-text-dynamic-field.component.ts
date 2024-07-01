import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import {
  LabReportTemplateTextEditorConfig
} from '../../../../../lab-report-template/lab-report-template-detail-page/lab-report-template-text-editor-config.class';

/**
 * Component to allow the rich text editor to be used as a dynamic field.
 */
@Component({
  selector: 'lab-rich-text-dynamic-field',
  templateUrl: './lab-rich-text-dynamic-field.component.html',
  styleUrl: './lab-rich-text-dynamic-field.component.scss',
})
export class LabRichTextDynamicFieldComponent extends FlDynamicFieldAbstractDirective {

  config = new LabReportTemplateTextEditorConfig({includeToolbarButton: true});
}
