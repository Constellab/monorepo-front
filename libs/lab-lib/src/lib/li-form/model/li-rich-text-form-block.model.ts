import { LiFormDisplayMode } from './li-form.enum';

export type LiRichTextFormDisplayMode = LiFormDisplayMode;

/**
 * Block data stored in the rich text JSON for a FORM block (Note context).
 */
export interface LiRichTextFormBlockData {
  form_id: string;
  is_owner: boolean;
  display_mode?: LiRichTextFormDisplayMode;
}

/**
 * Additional data passed to the FORM block via teComponentBlockFactory.
 */
export interface LiRichTextFormBlockAdditionalData {
  noteId: string;
}
