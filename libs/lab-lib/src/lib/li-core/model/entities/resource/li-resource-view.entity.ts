import { RvResourceView, RvResourceViewBase, RvResourceViewType } from '@monorepo/resource-view';
import { TdParamSpecs, TdParamSpecsValues, TdTypeStyle } from '@monorepo/technical-doc';
import { TeRichTextDTO } from '@monorepo/text-editor';
import { Expose, Type } from 'class-transformer';
import { LiRichTextObjectType } from '../../../entity-service/li-rich-text.service';
import { LiResourceViewFolder } from './li-resource-view-folder.class';
import { LiViewConfig } from './li-view-config.entity';

// list of available view type
export type LiResourceViewType = RvResourceViewType | 'view' | 'resources-list-view' | 'folder-view';

export class LiResourceViewSpec {
  @Expose({ name: 'method_name' })
  methodName: string;

  @Expose({ name: 'view_type' })
  viewType: LiResourceViewType;

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
export interface LiResourceViewSpecWithConfig {
  viewName: string;
  viewMethodName: string;
  viewConfigValues: TdParamSpecsValues;
}

/**
 * View that list other resources
 */
export interface LiResourceViewResourcesList extends RvResourceViewBase {
  type: 'resources-list-view';
  data: any[]; // list of LiResource
}

export class LiResourceView {
  view: LiResourceViewData;

  @Expose({ name: 'resource_id' })
  resourceId: string;

  @Expose({ name: 'view_config' })
  @Type(() => LiViewConfig)
  viewConfig?: LiViewConfig;

  title: string;

  @Expose({ name: 'view_type' })
  viewType: LiResourceViewType;

  style: TdTypeStyle;
}

/**
 * View rich text (like note)
 */
export interface LiResourceViewRichText extends RvResourceViewBase {
  type: 'rich-text-view';
  data: {
    title: string;
    content: TeRichTextDTO;
    object_type: LiRichTextObjectType;
    object_id?: string;
  };
}

//////////////////////////// TYPE THAT GROUP ALL VIEW TYPES /////////////////////////////
export type LiResourceViewData =
  | RvResourceView
  | LiResourceViewResourcesList
  | LiResourceViewFolder
  | LiResourceViewRichText;

export const excludedViewInNote: string[] = [
  'view',
  'folder-view',
  'resources-list-view',
  'empty-view',
  'rich-text-view',
  'app-view',
];
