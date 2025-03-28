import { TeConfig } from '@monorepo/text-editor';
import { LiResourceViewRichText } from './model/entities/resource/li-resource-view.entity';

/**
 * Provide this service to work with the Lab library.
 */
export abstract class LiConfig {
  abstract getSpaceDashboardLabUrl(labId: string): string;

  /**
   * Method to configure the view for text editor
   * It returns the text editor config based on the object type
   */
  abstract buildRichTextViewEditorConfig(viewData: LiResourceViewRichText, resourceId: string): TeConfig;
}
