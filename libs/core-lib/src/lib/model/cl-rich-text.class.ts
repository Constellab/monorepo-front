/**
 * Object representing the value stored to create a figure
 */
export interface ClRichTextFigure {
  filename: string;
  title?: string;
  caption?: string;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}


export interface ClRichTextMention {
  type: 'mention';
  userId: string;
  fullname: string;
}

export interface ClRichTextMentionText {
  type: 'text';
  text: string;
}

export interface ClRichTextMentionBlockData {
  elements: (ClRichTextMention | ClRichTextMentionText)[];
}

