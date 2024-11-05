import Table from '@editorjs/table';
import { SanitizerConfig } from '@editorjs/editorjs/types/configs';
import { TeHelper } from '../model/te.helper';

export default class TeTable extends Table {
  /**
   * Override the default sanitize to allow the use of the inline tools
   */
  static get sanitize(): SanitizerConfig {
    return TeHelper.getInlineToolSanitizeConfig(true);
  }
}
