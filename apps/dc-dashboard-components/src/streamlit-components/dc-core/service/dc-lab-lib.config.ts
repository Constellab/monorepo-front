import { Injectable } from '@angular/core';
import { LiConfig } from '@monorepo/lab-lib/li-core';
import { TeConfig } from '@monorepo/text-editor';
import { DcEnvironmentHelper } from '../dc-environment.helper';

@Injectable({
  providedIn: 'root',
})
export class DcLabLibConfig extends LiConfig {
  getSpaceDashboardLabUrl(labId: string): string {
    return DcEnvironmentHelper.getSpaceDashboardLabUrl(labId);
  }

  buildRichTextViewEditorConfig(): TeConfig {
    throw new Error('Method not implemented.');
  }
}
