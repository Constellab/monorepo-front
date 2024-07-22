import { InjectionToken } from '@angular/core';

/**
 * Config for the {@link FlIconModule}
 */
export interface FlIconConfig {
  /**
   * path (in assets) of the svg icons
   */
  iconFolder: string;

  /**
   * List of icons to register
   */
  iconsToRegister: FlIcon[];
}

export type FlIcon = FlSvgIcon | FlMatIcon

/**
 * Information to register an SVG icons
 */
export interface FlSvgIcon {
  name: string;
  filename: string;
}

/**
 * Information to register an icon that used MatIcon (useful to rename an icon)
 */
export interface FlMatIcon {
  name: string;
  matIconName: string;
}

/**
 * @ignore
 * Use to inject the configuration of the svg icon module
 *
 * Use '@Inject(FL_ICON_MODULE)' to inject it in component or service
 */
export const FL_ICON_MODULE =
  new InjectionToken<FlIconConfig>('FL_ICON_MODULE');

/**
 * List of default icon
 */
export const flIconsDefault: FlIcon[] = [
  {name: 'experiment', filename: 'flask-solid.svg'},
  {name: 'protocol', filename: 'cogs-solid.svg'},
  {name: 'protocol_template', filename: 'protocol-template.svg'},
  {name: 'process', filename: 'cogs-solid.svg'},
  {name: 'lab', filename: 'microscope-solid.svg'},
  {name: 'project', filename: 'briefcase-solid.svg'},
  {name: 'process_config', filename: 'task-configuration.svg'},
  {name: 'archive', matIconName: 'inventory_2'},
  {name: 'unarchive', matIconName: 'unarchive'},
  {name: 'report', matIconName: 'grading'},
  {name: 'document_template', filename: 'document-template.svg'},
  {name: 'resource', matIconName: 'folder'},
  {name: 'view', matIconName: 'insert_chart'},
  {name: 'smart_db', matIconName: 'search'},
  {name: 'organization', matIconName: 'business'},
  {name: 'group', matIconName: 'group'},
  {name: 'transformer', matIconName: 'move_down'},
  {name: 'validated', matIconName: 'verified'},
  {name: 'check_fill', filename: 'check-fill.svg'},
  {name: 'docx_file_icon', filename: 'docx-file-icon.svg'},
  {name: 'pptx_file_icon', filename: 'pptx-file-icon.svg'},
  {name: 'csv_file_icon', filename: 'csv-file-icon.svg'},
  {name: 'pdf_file_icon', filename: 'pdf-file-icon.svg'},
  {name: 'py_file_icon', filename: 'py-file-icon.svg'},
  {name: 'txt_file_icon', filename: 'txt-file-icon.svg'},
  {name: 'zip_file_icon', filename: 'zip-file-icon.svg'},
  {name: 'json_file_icon', filename: 'json-file-icon.svg'},
  {name: 'comment-accent', filename: 'comment-accent.svg'},
  {name: 'comment-primary', filename: 'comment-primary.svg'},
  {name: 'comment-warn', filename: 'comment-warn.svg'},
  {name: 'heart', filename: 'heart.svg'},
  {name: 'heart-fill', filename: 'heart-fill.svg'},
  {name: 'constellab_document', filename: 'constellab_document.svg'},
]
