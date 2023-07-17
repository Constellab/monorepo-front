import {FlQuillEmbed} from './fl-quill-export.class';
import {ClRichTextVideo} from '@monorepo/core-lib';

/**
 * Blot object for video
 */
export class FlTextEditorVideoBlot extends FlQuillEmbed {

  static blotName = 'video';
  static tagName = 'fl-text-editor-video';
  static className = 'g-quill-block';

  public domNode: HTMLElement;

  private readonly storedValue: ClRichTextVideo;

  static create(value: ClRichTextVideo): any {
    const node: HTMLElement = super.create(value) as any;

    node.setAttribute('url', value.url);
    node.setAttribute('video-title', value.title);
    node.setAttribute('caption', value.caption);

    return node;
  }

  constructor(node: Node, value: ClRichTextVideo) {
    super(node);
    this.storedValue = value;
  }

  value(): { video: ClRichTextVideo } {
    return {
      video: {
        url: this.storedValue.url,
        title: this.domNode.getAttribute('video-title'),
        caption: this.domNode.getAttribute('caption'),
      }
    };
  }
}

