import {Component, Input} from '@angular/core';
import {LabProtocolTemplate} from '../../../../model/entities/process/lab-protocol-template.entity';

@Component({
  selector: 'lab-protocol-template-inline',
  templateUrl: './lab-protocol-template-inline.component.html',
  styleUrls: ['./lab-protocol-template-inline.component.scss']
})
export class LabProtocolTemplateInlineComponent {

  @Input() protocolTemplate: LabProtocolTemplate;
}
