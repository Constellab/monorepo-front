import { Component, Input, OnInit } from '@angular/core';
import { LabProtocolTemplate } from '../../../../lab-core/model/entities/process/lab-protocol-template.entity';
import { LabProtocolTemplateService } from '../../../../lab-core/entity-service/lab-protocol-template.service';
import { TeBasicConfig, TeRichTextContent } from '@monorepo/text-editor';
import { LabTagService } from '../../../../lab-core/entity-service/lab-tag.service';
import { LabTagDatasource } from '../../../../lab-core/model/entities/lab-tag.entity';
import { FormControl } from '@angular/forms';
import { LabNoteContent } from '../../../../lab-core/model/entities/lab-note.entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'lab-protocol-template-detail',
  templateUrl: './lab-protocol-template-detail.component.html',
  styleUrls: ['./lab-protocol-template-detail.component.scss']
})
export class LabProtocolTemplateDetailComponent implements OnInit {

  @Input({ required: true }) template: LabProtocolTemplate;

  tags$: LabTagDatasource;

  formControl: FormControl<LabNoteContent> = new FormControl({ value: null });

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  saveDescriptionFunc = (value: TeRichTextContent): Observable<any> =>
    this.protocolTemplateService.updateProtocolTemplate(this.template.id, { description: value });

  constructor(private protocolTemplateService: LabProtocolTemplateService,
              private tagService: LabTagService) {
  }

  ngOnInit(): void {
    this.formControl.patchValue(this.template.description, { emitEvent: false });

    this.tags$ = this.tagService.getEntityTagsDatasource('PROTOCOL_TEMPLATE', this.template.id);
  }
}
