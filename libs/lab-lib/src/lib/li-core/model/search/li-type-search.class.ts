import { FormBuilder, FormGroup } from '@angular/forms';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { TdTypeObjectSubType, TdTypeObjectType } from '@monorepo/technical-doc';

import { LiSearchConverter } from '../global/li-search-converter.class';

/**
 * config for the lab type search component
 */
export type LiTypeSearchConfig =
  // Mode to filter on Task or protocol by default
  | {
      mode: 'process' | 'resource';
    }
  // Mode to filter on transformer for a specific resource
  | {
      mode: 'transformer';
      resourceTypingNames: string[];
    }
  // Mode to suggest a list of process based on a list of resource types
  | {
      mode: 'processSuggestion';
      //whether to compare the resource typings with process inputs or outputs
      suggestBy: 'inputs' | 'outputs';
      resourceTypingNames: string[];
    }

  // Mode to filter on importers for a specific resource and extension
  | {
      mode: 'importer';
      resourceTypingName: string;
      extension: string;
    };

/**
 * Format of the data for the Advanced search form of the resource
 */
export class LiTypeSearchFields {
  brick: string[];
  text: string;
  objectType: TdTypeObjectType[];
  objectSubType: TdTypeObjectSubType;
  includeDeprecated: boolean;
  importerIgnoreExtension: boolean; // only for importer mode, if true we don't filter on file extension
}

export class LiTypeSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiTypeSearchFields> = {
    text: 'li.name',
    objectSubType: 'li.process_type_type',
    includeDeprecated: 'li.type_include_deprecated',
    importerIgnoreExtension: 'li.type_importer_ignore_extension',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiTypeSearchFields> = {
    brick: { key: 'brick', operator: 'IN' },
    text: { key: 'text', operator: 'MATCH' },
    objectType: { key: 'object_type', operator: 'IN' },
    objectSubType: { key: 'object_sub_type', operator: 'EQ' },
    importerIgnoreExtension: { key: 'importer_ignore_extension', operator: 'EQ' },
    includeDeprecated: {
      key: 'include_deprecated',
      operator: 'EQ',
      convertValue: LiSearchConverter.includeAllOnCheck,
    },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'human_name',
    description: 'short_description',
    objectSubType: 'object_type',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      brick: [[]],
      text: [null],
      objectType: [null],
      objectSubType: [null],
      importerIgnoreExtension: [null],
      includeDeprecated: [null],
    });
  }
}
