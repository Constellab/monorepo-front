import { TD_PARAM_SPEC_INFO_LIST, TdParamSpecCategory, TdParamSpecInfo } from '@monorepo/technical-doc';

import { LiBaseEntityWithUser } from '../li-user.entity';

// Category display order in the form type list: advanced fields before lab-data fields.
export const LI_FORM_TEMPLATE_CATEGORY_ORDER: TdParamSpecCategory[] = [
  TdParamSpecCategory.SIMPLE,
  TdParamSpecCategory.OTHER,
  TdParamSpecCategory.LAB_SPECIFIC,
];

/**
 * Filters and orders param spec infos for the form template editor:
 * hides code params (not relevant for form templates) and orders the remaining
 * categories so "Advanced" (other) comes before "Lab data" (lab_specific).
 */
export function liFilterAndOrderFormTemplateParamSpecsInfos(): TdParamSpecInfo[] {
  return TD_PARAM_SPEC_INFO_LIST.filter((info) => info.category !== TdParamSpecCategory.CODE)
    .sort(
      (a, b) =>
        LI_FORM_TEMPLATE_CATEGORY_ORDER.indexOf(a.category) -
        LI_FORM_TEMPLATE_CATEGORY_ORDER.indexOf(b.category)
    );
}

export class LiFormTemplate extends LiBaseEntityWithUser {
  name: string;

  description: string | null;

  isLoaded(): boolean {
    return this.name != null;
  }

  public toString(): string {
    return this.name;
  }
}

export interface LiCreateFormTemplateDTO {
  name: string;
  description?: string | null;
  tags?: string[];
}

export interface LiUpdateFormTemplateDTO {
  name?: string;
  description?: string | null;
}

export interface LiDuplicateFormTemplateDTO {
  name?: string;
  description?: string | null;
}
