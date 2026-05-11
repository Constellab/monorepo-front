export type LiFormTemplateVersionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type LiFormStatus = 'DRAFT' | 'SUBMITTED';

export type LiFormDisplayMode = 'form' | 'json' | 'table';

export type LiFormChangeAction =
  | 'FIELD_CREATED'
  | 'FIELD_UPDATED'
  | 'FIELD_DELETED'
  | 'PARAMSET_ITEM_ADDED'
  | 'PARAMSET_ITEM_REMOVED'
  | 'STATUS_CHANGED';
