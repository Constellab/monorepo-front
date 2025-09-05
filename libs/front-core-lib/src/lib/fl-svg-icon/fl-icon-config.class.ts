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

export type FlIcon = FlSvgIcon | FlMatIcon;

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
export const FL_ICON_MODULE = new InjectionToken<FlIconConfig>('FL_ICON_MODULE');

/**
 * List of default icon
 */
export const flIconsDefault: FlIcon[] = [
  { name: 'scenario', matIconName: 'slow_motion_video' },
  { name: 'protocol', filename: 'cogs-solid.svg' },
  { name: 'scenario_template', matIconName: 'extension' },
  { name: 'process', filename: 'cogs-solid.svg' },
  { name: 'lab', matIconName: 'dns' },
  { name: 'process_config', filename: 'task-configuration.svg' },
  { name: 'archive', matIconName: 'inventory_2' },
  { name: 'unarchive', matIconName: 'unarchive' },
  { name: 'note', matIconName: 'description' },
  { name: 'note_template', filename: 'note-template.svg' },
  { name: 'resource', filename: 'boxes.svg' },
  { name: 'view', matIconName: 'insert_chart' },
  { name: 'organization', matIconName: 'business' },
  { name: 'group', matIconName: 'group' },
  { name: 'transformer', matIconName: 'move_down' },
  { name: 'validated', matIconName: 'verified' },
  { name: 'check_fill', filename: 'check-fill.svg' },
  { name: 'docx_file_icon', filename: 'docx-file-icon.svg' },
  { name: 'pptx_file_icon', filename: 'pptx-file-icon.svg' },
  { name: 'csv_file_icon', filename: 'csv-file-icon.svg' },
  { name: 'pdf_file_icon', filename: 'pdf-file-icon.svg' },
  { name: 'py_file_icon', filename: 'py-file-icon.svg' },
  { name: 'txt_file_icon', filename: 'txt-file-icon.svg' },
  { name: 'zip_file_icon', filename: 'zip-file-icon.svg' },
  { name: 'json_file_icon', filename: 'json-file-icon.svg' },
  { name: 'comment-accent', filename: 'comment-accent.svg' },
  { name: 'comment-primary', filename: 'comment-primary.svg' },
  { name: 'comment-warn', filename: 'comment-warn.svg' },
  { name: 'heart', filename: 'heart.svg' },
  { name: 'heart-fill', filename: 'heart-fill.svg' },
  { name: 'constellab_document', matIconName: 'description' },
  { name: 'brick', filename: 'brick_logo.svg' },
  { name: 'agent', filename: 'agent_logo.svg' },
  { name: 'app', filename: 'app_logo.svg' },
  { name: 'story', filename: 'story_logo.svg' },
  { name: 'tag', matIconName: 'local_offer' },
  { name: 'shine', filename: 'shine.svg' },
];

export function getFileIconFromExtension(extension: string): string {
  if (!extension) return 'insert_drive_file';

  extension = extension.replace('.', '').toLowerCase();

  switch (extension.toLowerCase()) {
    case 'csv':
    case 'xls':
    case 'xlsx':
      return 'csv_file_icon';
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'gif':
    case 'svg':
      return 'image';
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return 'audiotrack';
    case 'txt':
      return 'txt_file_icon';
    case 'pdf':
      return 'pdf_file_icon';
    case 'doc':
    case 'docx':
      return 'docx_file_icon';
    case 'json':
      return 'json_file_icon';
    case 'ppt':
    case 'pptx':
      return 'pptx_file_icon';
    case 'zip':
      return 'zip_file_icon';
    case 'py':
      return 'py_file_icon';
    default:
      return 'insert_drive_file';
  }
}
