import { Expose, Type } from 'class-transformer';
import { RvResourceView, RvResourceViewBase, RvResourceViewType } from '@monorepo/resource-view';
import { LabResourceViewFolder } from './lab-resource-view-folder.class';
import { LabViewConfig } from './lab-view-config.entity';
import { PrConfigValues } from '@monorepo/protocol';
import { TdParamSpecs, TdTypeStyle } from '@monorepo/technical-doc';
import { LabRichTextObjectType } from '../../../entity-service/lab-rich-text.service';
import { TeRichTextDTO } from '@monorepo/text-editor';

// list of available view type
export type LabResourceViewType = RvResourceViewType | 'view' | 'resources-list-view' | 'folder-view';

export class LabResourceViewSpec {
  @Expose({ name: 'method_name' })
  methodName: string;

  @Expose({ name: 'view_type' })
  viewType: LabResourceViewType;

  @Expose({ name: 'human_name' })
  humanName: string;

  @Expose({ name: 'short_description' })
  shortDescription: string;

  @Expose({ name: 'default_view' })
  defaultView: boolean;

  // true if the view has config specs
  @Expose({ name: 'has_config_specs' })
  hasConfigSpecs: boolean;

  @Expose({ name: 'config_specs' })
  configSpecs: TdParamSpecs;

  style: TdTypeStyle;

  getName(): string {
    return this.humanName ?? this.methodName;
  }
}

/**
 * Object that contains the resource view spec and its configuration
 */
export interface LabResourceViewSpecWithConfig {
  viewName: string;
  viewMethodName: string;
  viewConfigValues: PrConfigValues;
}

/**
 * View that list other resources
 */
export interface LabResourceViewResourcesList extends RvResourceViewBase {
  type: 'resources-list-view';
  data: any[]; // list of LabResource
}

export class LabResourceView {
  view: LabResourceViewData;

  @Expose({ name: 'resource_id' })
  resourceId: string;

  @Expose({ name: 'view_config' })
  @Type(() => LabViewConfig)
  viewConfig?: LabViewConfig;

  title: string;

  @Expose({ name: 'view_type' })
  viewType: LabResourceViewType;

  style: TdTypeStyle;
}

/**
 * View rich text (like note)
 */
export interface LabResourceViewRichText extends RvResourceViewBase {
  type: 'rich-text-view';
  data: {
    title: string;
    content: TeRichTextDTO;
    object_type: LabRichTextObjectType;
    object_id?: string;
  };
}

//////////////////////////// TYPE THAT GROUP ALL VIEW TYPES /////////////////////////////
export type LabResourceViewData =
  | RvResourceView
  | LabResourceViewResourcesList
  | LabResourceViewFolder
  | LabResourceViewRichText;

export const excludedViewInNote: string[] = [
  'view',
  'folder-view',
  'resources-list-view',
  'empty-view',
  'rich-text-view',
  'streamlit-view',
];
