import { Component, OnInit } from '@angular/core';
import { RvResourceViewDirective } from '@monorepo/resource-view';
import { LabResourceViewRichText } from '../../../../model/entities/resource/lab-resource-view.entity';
import { LabNoteResourceTextEditorConfig } from '../../model/lab-note-resource-text-editor.config';
import { TeConfig } from '@monorepo/text-editor';
import {
  LabDocumentTemplateTextEditorConfig
} from '../../../../../lab-document-template/lab-document-template-detail-page/lab-document-template-text-editor-config.class';
import { LabRichTextObjectType } from '../../../../entity-service/lab-rich-text.service';
import {
  LabNoteTextEditorConfig
} from '../../../../../lab-note/module/lab-note-detail-page/lab-note-text-editor-config.class';

@Component({
  selector: 'lab-resource-rich-text-view',
  templateUrl: './lab-resource-rich-text-view.component.html',
  styleUrls: ['./lab-resource-rich-text-view.component.scss']
})
export class LabResourceRichTextViewComponent
  extends RvResourceViewDirective<LabResourceViewRichText> implements OnInit {

  textEditorConfig: TeConfig;

  ngOnInit(): void {
    switch (this.view.data.object_type) {
      case LabRichTextObjectType.NOTE:
        this.textEditorConfig = new LabNoteTextEditorConfig(this.view.data.object_id);
        break;
      case LabRichTextObjectType.DOCUMENT_TEMPLATE:
        this.textEditorConfig = new LabDocumentTemplateTextEditorConfig(this.view.data.object_id);
        break;
      case LabRichTextObjectType.NOTE_RESOURCE:
        this.textEditorConfig = new LabNoteResourceTextEditorConfig(this.resourceId);
        break;
    }
  }
}
