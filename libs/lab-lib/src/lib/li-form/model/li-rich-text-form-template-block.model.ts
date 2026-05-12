/**
 * Block data stored in the rich text JSON for a FORM_TEMPLATE block (NoteTemplate context).
 */
export interface LiRichTextFormTemplateBlockData {
  form_template_id: string;
  form_template_version_id: string;
  display_name: string;
}

/**
 * Additional data passed to the FORM_TEMPLATE block via teComponentBlockFactory.
 */
export interface LiRichTextFormTemplateBlockAdditionalData {
  noteTemplateId: string;
}
