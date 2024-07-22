import { Component, Input } from '@angular/core';
import { LabDocumentTemplate } from '../../../../model/entities/lab-document-template.entity';

@Component({
  selector: 'lab-document-template-inline',
  templateUrl: './lab-document-template-inline.component.html',
  styleUrls: ['./lab-document-template-inline.component.scss'],
})
export class LabDocumentTemplateInlineComponent {
  @Input({required: true}) documentTemplate: LabDocumentTemplate;

}
