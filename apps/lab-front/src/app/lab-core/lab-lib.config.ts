import { Injectable } from '@angular/core';
import { LiConfig, LiResourceViewRichText, LiRichTextObjectType } from '@monorepo/lab-lib/li-core';
import { LiNoteResourceTextEditorConfig } from '@monorepo/lab-lib/li-resource';
import { TeConfig } from '@monorepo/text-editor';

import { LabNoteTextEditorConfig } from '../lab-note/module/lab-note-detail-page/lab-note-text-editor-config.class';
import { LabNoteTemplateTextEditorConfig } from '../lab-note-template/lab-note-template-detail-page/lab-note-template-text-editor-config.class';
import { LabEnvironmentHelper } from './lab-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class LabLibConfig extends LiConfig {
  getSpaceDashboardLabUrl(labId: string): string {
    return LabEnvironmentHelper.getSpaceDashboardLabUrl(labId);
  }

  buildRichTextViewEditorConfig(viewData: LiResourceViewRichText, resourceId: string): TeConfig {
    switch (viewData.data.object_type) {
      case LiRichTextObjectType.NOTE:
        if (viewData.data.object_id == null) {
          throw new Error('Missing object_id for a note rich text view');
        }
        return new LabNoteTextEditorConfig(viewData.data.object_id);
      case LiRichTextObjectType.NOTE_TEMPLATE:
        if (viewData.data.object_id == null) {
          throw new Error('Missing object_id for a note template rich text view');
        }
        return new LabNoteTemplateTextEditorConfig(viewData.data.object_id);
      case LiRichTextObjectType.NOTE_RESOURCE:
        return new LiNoteResourceTextEditorConfig(resourceId);
      default:
        throw new Error('Unknown object type');
    }
  }
}
