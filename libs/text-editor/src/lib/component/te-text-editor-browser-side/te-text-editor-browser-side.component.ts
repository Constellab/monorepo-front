import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EditorConfig } from '@editorjs/editorjs/types/configs/editor-config';
import { ClHelpService, ClStringHelper } from '@monorepo/core-lib';
import { FlHtmlHelper, FlKeyboardHelper, FlKeyboardKey } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { marked } from 'marked';
import { Subject, Subscription } from 'rxjs';

import { TeHTMLEditorJSON, TeRichText, TeRichTextAggregate, TeRichTextModifications } from '../../model/lib';
import { TeConfig } from '../../model/te-config.class';
import { TeEvent } from '../../model/te-event.class';
import { TeSourceUrlRegistry } from '../../model/te-source-url-registry';
import { TeTextEditorUndoRedo } from '../../model/te-text-editor-undo-redo.class';
import { TeEmoji } from '../../plugin/te-emoji.class';
import { TeMention } from '../../plugin/te-mention.class';
import { teGetI18nConfig } from '../../te-text-editor.i18n';

TeRichTextModifications.setFrontTimeDifference();

@Component({
  selector: 'te-text-editor-browser-side',
  templateUrl: './te-text-editor-browser-side.component.html',
  styleUrl: './te-text-editor-browser-side.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TeTextEditorBrowserSideComponent implements OnInit, OnDestroy {
  private envInjector = inject(EnvironmentInjector);
  private applicationRef = inject(ApplicationRef);
  private translateService = inject(FlTranslateService);

  @Input({ required: true }) config: TeConfig;

  @Input() event: TeEvent;

  @Input() placeholder: string;

  @Output() textChange: EventEmitter<TeRichText> = new EventEmitter();

  @ViewChild('editorContainer', { static: true }) editorContainer: ElementRef<HTMLElement>;

  richText = input.required<TeRichText>();

  disabled = input<boolean>(true);

  private richTextAggregate: TeRichTextAggregate;

  private editor: any | null;

  private subscription: Subscription;

  isLoaded$: Subject<boolean> = new Subject<boolean>();

  @HostBinding('class.g-text-editor-hide-toolbar')
  hideToolbar: boolean = false;

  @HostBinding('class.include-toolbar-button')
  includeToolbarButton: boolean = false;

  private textEditorUndoRedo: TeTextEditorUndoRedo;

  private firstInit = true;

  // use to prevent init is the component is destroyed
  private destroyed = false;

  private skipNextChange = false;

  constructor() {
    // create richTextAggregate from richText and render the value
    effect(() => {
      const richText = this.richText();
      if (richText && !(richText instanceof TeRichText)) {
        throw new Error('[TeTextEditorBrowserSideComponent] RichText must be an instance of TeRichText');
      }
      // check if richText has changed to avoid circular updates
      if (this.richTextAggregate && this.richTextAggregate.richText.contentAreEquals(richText)) return;
      this.richTextAggregate = new TeRichTextAggregate(richText);
      this.renderValue(richText);
    });

    effect(() => {
      this.onDisableChange(this.disabled());
    });
  }

  async ngOnInit(): Promise<void> {
    this.hideToolbar = this.config.uiConfig.hideToolbar;
    this.includeToolbarButton = this.config.uiConfig.includeToolbarButton;

    // Always listen for copy/cut to register figure source URLs (even in read mode)
    document.addEventListener('copy', this.copyHandler, true);
    document.addEventListener('cut', this.copyHandler, true);
    this.editorContainer.nativeElement.addEventListener('paste', this.pasteMarkdownAsHtmlHandler, true);
    this.editorContainer.nativeElement.addEventListener('paste', this.pasteUrlAsLinkHandler, true);

    setTimeout(async () => {
      import('@editorjs/editorjs').then((module) => {
        this.initEditor(module);
      });
    }, 0);
  }

  private onDisableChange(disable: boolean): void {
    if (disable) {
      this.destroyListeners();
    } else {
      this.createListeners();
    }

    if (this.editor == null || this.editor.readOnly == null) return;
    if (disable !== this.editor.readOnly.isEnabled) {
      // if we disable it, we save the content first because the save
      // method can be called only if the editor is not in readOnly mode
      if (!this.editor.readOnly.isEnabled) {
        this.onTextEditorChange().then(() => this.editor.readOnly.toggle(true));
      } else {
        this.editor.readOnly.toggle(false);
      }
    }
  }

  private async initEditor(module: any): Promise<void> {
    if (this.destroyed) return;
    const config: EditorConfig = {
      placeholder: this.placeholder ?? this.translateService.translate('teTextEditor.placeholder'),
      holder: this.editorContainer.nativeElement,
      // set order for the inline tools
      inlineToolbar: this.config.getInlineToolbar(),
      readOnly: this.disabled(),
      tools: this.config.getTools(this.envInjector, this.applicationRef),
      onChange: () => this.onTextEditorChange(),
      defaultBlock: this.config.getDefaultBlock(),
      tunes: this.config.getTunes(),
      i18n: teGetI18nConfig(this.translateService),
    };
    this.editor = new module.default(config);
    this.editor.isReady.then(() => {
      // if the destroy method was called
      if (this.destroyed) return;
      // render the value here and not in the editor config
      // because if the editor config is initialized with data
      // a blank line is added
      this.renderValue(this.richTextAggregate.richText);
    });
    this.textEditorUndoRedo = new TeTextEditorUndoRedo(this.editor);
  }

  private renderValue(richText: TeRichText): void {
    if (this.editor) {
      this.editor.isReady.then(() => {
        // if the destroy method was called
        if (this.destroyed) return;

        // check if the editor has the focus
        const isFocused =
          document &&
          document.activeElement &&
          FlHtmlHelper.isChildOf(document.activeElement as HTMLElement, {
            element: this.editorContainer.nativeElement,
          });

        let render: Promise<void>;
        if (ClHelpService.isNullOrEmpty(richText)) {
          render = this.editor.blocks.clear();
        } else {
          if (this.firstInit) {
            render = this.editor.render(richText).then(() => {
              this.isLoaded$.next(true);

              this.event?.htmlIsInitiated();
              this.firstInit = false;
            });
          } else {
            render = this.editor.render(richText.toHTMLEditorJson());
          }
        }

        // used to refocus the editor after the render
        if (isFocused && render) {
          render.then(() => {
            // use a timeout to let the editor render the content
            setTimeout(() => {
              this.editor.focus();
            }, 300);
          });
        }
      });
    }
  }

  private async onTextEditorChange(): Promise<void> {
    if (this.skipNextChange) {
      this.skipNextChange = false;
      return;
    }
    // the save method can be called only if the editor is not in readOnly mode
    if (!this.editor?.readOnly || this.editor.readOnly.isEnabled) return;

    this.ensureTrailingEmptyParagraph();

    const outputData: TeHTMLEditorJSON = await this.editor.save();
    // if the data is null, there was an error in the editor, don't emit the event
    // so the content is not cleared
    if (outputData == null) return;

    const newRichText = TeRichText.fromHTMLEditorJson(outputData);

    // check if outputData is different from the current value
    if (newRichText.contentAreEquals(this.richTextAggregate.richText)) return;

    // update the content and set the user as the current user
    this.richTextAggregate.updateContent(newRichText, 'current');

    this.textChange.emit(this.richTextAggregate.richText);
  }

  /**
   * Ensure there is always an empty paragraph at the end of the editor.
   * This allows users to easily add content after non-text blocks (images, tables, etc.).
   */
  private ensureTrailingEmptyParagraph(): void {
    const blocksCount = this.editor.blocks.getBlocksCount();
    if (blocksCount === 0) return;

    const lastBlock = this.editor.blocks.getBlockByIndex(blocksCount - 1);
    if (!lastBlock) return;

    // If the last block is already an empty paragraph, no need to add another one
    if (lastBlock.name === 'paragraph' && lastBlock.isEmpty) return;

    this.editor.blocks.insert('paragraph', { text: '' });
  }

  /////////////////////// LISTENERS ///////////////////////

  private outsideUndoRedoListener = async (e: any): Promise<void> => {
    await this.onKeyDown(e);
  };

  private containerKeyPressedListener = (event: KeyboardEvent): void => {
    this.onEditorKeyPressed(event);
  };

  private createListeners(): void {
    // listener for undo/redo
    this.editorContainer.nativeElement.addEventListener('keydown', this.outsideUndoRedoListener);

    // enable emoji picker globally
    this.editorContainer.nativeElement.addEventListener('keypress', this.containerKeyPressedListener);

    this.listenToConfigEvent();
  }

  private listenToConfigEvent(): void {
    const obs = this.event?.getEvent$();
    if (obs) {
      this.subscription = obs.subscribe((event) => {
        if (event.type === 'insertBlock') {
          this.editor?.blocks?.insert(event.blockType, event.data);
        }
      });
    }
  }

  private destroyListeners(): void {
    this.editorContainer?.nativeElement.removeEventListener('keydown', this.outsideUndoRedoListener);
    this.editorContainer?.nativeElement.removeEventListener('keypress', this.containerKeyPressedListener);

    this.subscription?.unsubscribe();
  }

  private async onKeyDown(e: KeyboardEvent): Promise<void> {
    if ((e.metaKey || e.ctrlKey) && e.key == 'z') {
      this.undoEvent(e);
    } else if ((e.metaKey || e.ctrlKey) && e.key == 'y') {
      this.redoEvent(e);
    }
  }

  undoEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.textEditorUndoRedo.undoEvent(this.richTextAggregate);

    this.skipNextChange = true;
    this.textChange.emit(this.richTextAggregate.richText);
  }

  redoEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.textEditorUndoRedo.redoEvent(this.richTextAggregate);

    this.skipNextChange = true;
    this.textChange.emit(this.richTextAggregate.richText);
  }

  private onEditorKeyPressed(event: KeyboardEvent): void {
    // use a time to let the character be added to the text
    setTimeout(() => {
      const additionalConfig = this.config.getAdditionalConfig();
      if (event.key === FlKeyboardKey.COLON && additionalConfig.emoji) {
        const emoji = new TeEmoji(event);
        emoji.init();
      } else if (FlKeyboardHelper.keypressIsAt(event.key) && this.config.getAdditionalConfig().mention) {
        const mention = new TeMention(this.config.getAdditionalConfig().mention, event);
        mention.init();
      }
    }, 0);
  }

  /**
   * On paste, if the pasted content is plain markdown containing fenced code blocks,
   * convert it to HTML so EditorJS can properly create code blocks instead of inline code.
   */
  private pasteMarkdownAsHtmlHandler = (e: ClipboardEvent): void => {
    const html = e.clipboardData?.getData('text/html');
    // If HTML is already provided, let EditorJS handle it natively
    if (html) return;

    const text = e.clipboardData?.getData('text/plain');
    if (!text) return;

    // Only intercept if the text contains markdown fenced code blocks
    if (!/^```/m.test(text)) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const renderer = new marked.Renderer();
    // Render code blocks with language class so TeCodeBlock.onPaste can detect the language
    renderer.code = (code: string, language: string): string => {
      const langClass = language ? ` class="language-${language}"` : '';
      return `<pre${langClass}>${code}</pre>`;
    };

    const convertedHtml = marked.parse(text, { renderer }) as string;

    const dt = new DataTransfer();
    dt.setData('text/html', convertedHtml);
    dt.setData('text/plain', text);
    const newEvent = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
    e.target.dispatchEvent(newEvent);
  };

  /**
   * On paste, if the pasted content is a URL, convert it to a clickable link.
   */
  private pasteUrlAsLinkHandler = (e: ClipboardEvent): void => {
    const text = e.clipboardData?.getData('text/plain')?.trim();
    if (!text) return;

    // Check if the entire pasted text is a single URL
    if (!ClStringHelper.isHttpLink(text)) return;

    // If the HTML already contains a link, let EditorJS handle it
    const html = e.clipboardData?.getData('text/html');
    if (html && html.includes('<a ')) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    document.execCommand('insertHTML', false, `<a href="${text}">${text}</a>`);
  };

  /**
   * On copy/cut, register source URLs for all blocks with document-specific resources
   * (figures, resource views, etc.). Each block sets data-te-source-url and
   * data-te-source-filename attributes on its host element.
   */
  private copyHandler = (): void => {
    const elements = this.editorContainer.nativeElement.querySelectorAll('[data-te-source-url]');
    if (elements.length === 0) return;

    TeSourceUrlRegistry.clear();
    elements.forEach((el: Element) => {
      const url = el.getAttribute('data-te-source-url');
      const filename = el.getAttribute('data-te-source-filename');
      if (url && filename) {
        TeSourceUrlRegistry.set(filename, url);
      }
    });
  };

  printJson(): void {
    this.editor.save().then((data: any) => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.editor) {
      // wait for the editor to be ready before destroying it
      // we must destroy it, otherwise there is a memory leak
      this.editor.isReady.then(() => {
        this.editor.destroy();
      });
    }
    this.isLoaded$.complete();
    this.destroyListeners();
    document.removeEventListener('copy', this.copyHandler, true);
    document.removeEventListener('cut', this.copyHandler, true);
    this.editorContainer?.nativeElement.removeEventListener('paste', this.pasteMarkdownAsHtmlHandler, true);
    this.editorContainer?.nativeElement.removeEventListener('paste', this.pasteUrlAsLinkHandler, true);
  }
}
