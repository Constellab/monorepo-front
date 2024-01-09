import {ClHelpService} from '../utils/cl-help.service';

export interface ClRichTextI {
  ops: ClRichTextOp[];
}

export interface ClRichTextOp {
  insert: any;
  attributes?: any;
}


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

/**
 * Object representing the value stored to create a video
 */
export interface ClRichTextVideo {
  url: string;
  title?: string;
  caption?: string;
}


/**
 * Object representing the value stored to create a formula
 */
export interface ClRichTextFormula {
  formula: string;
  title?: string;
  caption?: string;
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


export class ClRichText {


  private static readonly figureOps = 'figure';

  constructor(private richText: ClRichTextI) {

  }

  public static isEmpty(content: ClRichTextI): boolean {
    let isEmpty = true;
    if (!ClHelpService.isNullOrEmpty(content) && content.ops) {
      for (const op of content.ops) {
        if (op.insert && (op.insert.length > 0 && !(/^\s*$/.test(op.insert)) || op.insert.figure)) {
          isEmpty = false;
        }
      }
    }
    return isEmpty;
  }


  public static addEmoji(content: ClRichTextI, emoji: string): ClRichTextI {
    if (this.isEmpty(content)) {
      content.ops = [{insert: emoji}];
    } else {
      if (content.ops[content.ops.length - 1].insert && (typeof content.ops[content.ops.length - 1].insert === 'string' ||
        content.ops[content.ops.length - 1].insert instanceof String)) {
        let insert = content.ops[content.ops.length - 1].insert;
        if (insert.endsWith('\n')) {
          insert = insert.substring(0, insert.length - 1);
        }
        content.ops[content.ops.length - 1].insert = insert + emoji;
      } else {
        content.ops.push({insert: emoji});
      }
    }
    return content;
  }

  public getContent(): ClRichTextI {
    return this.richText;
  }

  //TODO: Voir comment améliorer la méthode
  public getHeaders(headersSize: number[]): any[] {
    const headers: any[] = [];
    const contentData: any[] = this.getContent().ops;
    if (contentData != null) {
      const listId: string[] = [];
      contentData.forEach((c, i) => {
        if (contentData[i + 1] && contentData[i + 1].attributes && contentData[i + 1].attributes.header
          && (headersSize.includes(contentData[i + 1].attributes.header.level) ||
            headersSize.includes(contentData[i + 1].attributes.header)) && typeof c.insert === 'string') {
          const inserts: string[] = c.insert.split('\n');

          if (contentData[i + 1].attributes.header.id) {

            contentData[i + 1].attributes.header.id =
              contentData[i + 1].attributes.header.id.replace(new RegExp(/[&?~/|\\'"[()\]%!§:;.,*^¨}{@°`]/g), '');

            if (contentData[i + 1].attributes.header.id.length > 0) {
              const nbSame: number = listId.filter(value => value == contentData[i + 1].attributes.header.id).length;
              if (nbSame > 0)
                contentData[i + 1].attributes.header.id = contentData[i + 1].attributes.header.id + nbSame;
              listId.push(contentData[i + 1].attributes.header.id);
            } else {
              delete contentData[i + 1].attributes.header.id;
            }
          }


          if (inserts.length > 1) {
            headers.push({
              level: contentData[i + 1].attributes.header.level,
              id: contentData[i + 1].attributes.header.id ?? null,
              title: inserts[inserts.length - 1]
            });
          } else headers.push({
            level: contentData[i + 1].attributes.header.level,
            id: contentData[i + 1].attributes.header.id ?? null,
            title: c.insert
          });

        }
      });
    }
    return headers;
  }


  // Get the first figure link of the content
  public getFirstFigureLink(): string {
    const content: ClRichTextI = this.getContent();
    let firstPictureLink = '';
    if (content.ops) {
      for (const op of content.ops) {
        if (op.insert && op.insert.figure && op.insert.figure.filename) {
          firstPictureLink = op.insert.figure.filename;
          break;
        }
      }
    }
    return firstPictureLink;
  }
}
