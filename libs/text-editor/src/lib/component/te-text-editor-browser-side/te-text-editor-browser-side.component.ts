import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TeConfig } from '../../model/te-config.class';
import { Subject, Subscription } from 'rxjs';
import { EditorConfig } from '@editorjs/editorjs/types/configs/editor-config';
import { FlKeyboardHelper, FlKeyboardKey, FlTranslateService } from '@monorepo/front-core-lib';
import { teGetI18nConfig } from '../../te-text-editor.i18n';
import { TeMention } from '../../plugin/te-mention.class';
import { ClHelpService } from '@monorepo/core-lib';
import { TeEmoji } from '../../plugin/te-emoji.class';
import { TeEvent } from '../../model/te-event.class';
import {
  TeHTMLEditorJSON,
  TeRichText,
  TeRichTextAggregate,
  TeRichTextBlockModification,
  TeRichTextModifications,
  TeRichTextModificationType,
} from '../../model/lib';

TeRichTextModifications.setFrontTimeDifference();

@Component({
  selector: 'te-text-editor-browser-side',
  templateUrl: './te-text-editor-browser-side.component.html',
  styleUrl: './te-text-editor-browser-side.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeTextEditorBrowserSideComponent implements OnInit, OnDestroy {
  static id = 0;

  id = TeTextEditorBrowserSideComponent.id++;

  @Input({ required: true }) config: TeConfig;

  @Input() event: TeEvent;

  @Input() placeholder: string;

  @Output() textChange: EventEmitter<TeRichText> = new EventEmitter();

  @ViewChild('editorContainer', { static: true }) editorContainer: ElementRef<HTMLElement>;

  @Input({ required: true }) set richText(richText: TeRichText) {
    if (richText && !(richText instanceof TeRichText)) {
      throw new Error('[TeTextEditorBrowserSideComponent] RichText must be an instance of TeRichText');
    }
    // check if richText has changed to avoid circular updates
    if (this._richTextAggregate && this._richTextAggregate.richText.contentAreEquals(richText)) return;
    this._richTextAggregate = new TeRichTextAggregate(richText);
    this.renderValue(richText);
  }

  private _richTextAggregate: TeRichTextAggregate;

  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.onDisableChange(this._disabled);
  }

  private _disabled: boolean = false;

  private editor: any | null;

  private subscription: Subscription;

  private firstInit = true;

  isLoaded$: Subject<boolean> = new Subject<boolean>();

  @HostBinding('class.g-text-editor-hide-toolbar')
  hideToolbar: boolean = false;

  @HostBinding('class.include-toolbar-button')
  includeToolbarButton: boolean = false;

  private outsideUndoRedoListener = async (e: any): Promise<void> => {
    await this.checkKey(e);
  };

  // use to prevent init is the component is destroyed
  private destroyed = false;

  private skipNextChange = false;

  constructor(
    private envInjector: EnvironmentInjector,
    private applicationRef: ApplicationRef,
    private translateService: FlTranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    this.hideToolbar = this.config.uiConfig.hideToolbar;
    this.includeToolbarButton = this.config.uiConfig.includeToolbarButton;

    // enable emoji picker globally
    this.editorContainer.nativeElement.addEventListener('keypress', (event: KeyboardEvent) => {
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
    });

    setTimeout(async () => {
      import('@editorjs/editorjs').then((module) => {
        this.initEditor(module);
      });
    }, 0);
  }

  private onDisableChange(disable: boolean): void {
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

  async undoEvent(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (!this._disabled) {
      const undoResult: TeRichTextBlockModification = this._richTextAggregate.undoLastModification();

      if (undoResult == null) {
        return;
      }

      switch (undoResult.type) {
        case TeRichTextModificationType.CREATED:
          this.editor.blocks.delete(undoResult.index);
          this.setCaret(undoResult.index - 1);
          break;
        case TeRichTextModificationType.DELETED:
          if (this.editor.blocks.getById(undoResult.blockId) != null) {
            this.editor.blocks.delete(this.editor.blocks.getBlockIndex(undoResult.blockId));
          }
          const deletedBlock = this._richTextAggregate.richText.getBlock(undoResult.blockId);
          this.editor.blocks.insertMany([deletedBlock], undoResult.index);
          this.setCaret(undoResult.index);
          break;
        case TeRichTextModificationType.UPDATED:
          const updatedBlock = this._richTextAggregate.richText.getBlock(undoResult.blockId);
          this.editor.blocks.insertMany([updatedBlock], undoResult.index);
          this.editor.blocks.delete(undoResult.index + 1);
          break;
        case TeRichTextModificationType.MOVED:
          this.editor.blocks.move(undoResult.oldIndex, undoResult.index);
          this.setCaret(undoResult.oldIndex);
          break;
      }

      this.skipNextChange = true;
      this.textChange.emit(this._richTextAggregate.richText);
    }
  }

  async redoEvent(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (!this._disabled) {
      const redoResult: TeRichTextBlockModification = this._richTextAggregate.redoLastModification();

      if (redoResult == null) {
        return;
      }

      switch (redoResult.type) {
        case TeRichTextModificationType.CREATED:
          if (this.editor.blocks.getById(redoResult.blockId) != null) {
            this.editor.blocks.delete(this.editor.blocks.getBlockIndex(redoResult.blockId));
          }
          const createdBlock = this._richTextAggregate.richText.getBlock(redoResult.blockId);
          this.editor.blocks.insertMany([createdBlock], redoResult.index);
          this.setCaret(redoResult.index);
          break;
        case TeRichTextModificationType.DELETED:
          this.editor.blocks.delete(redoResult.index);
          this.setCaret(redoResult.index - 1);
          break;
        case TeRichTextModificationType.UPDATED:
          const updatedBlock = this._richTextAggregate.richText.getBlock(redoResult.blockId);
          this.editor.blocks.insertMany([updatedBlock], redoResult.index);
          this.editor.blocks.delete(redoResult.index + 1);
          break;
        case TeRichTextModificationType.MOVED:
          this.editor.blocks.move(redoResult.index, redoResult.oldIndex);
          this.setCaret(redoResult.index);
          break;
      }

      this.skipNextChange = true;
      this.textChange.emit(this._richTextAggregate.richText);
    }
  }

  private async initEditor(module: any): Promise<void> {
    if (this.destroyed) return;
    const config: EditorConfig = {
      placeholder: this.placeholder ?? this.translateService.translate('teTextEditor.placeholder'),
      holder: this.editorContainer.nativeElement,
      // set order for the inline tools
      inlineToolbar: this.config.getInlineToolbar(),
      readOnly: this._disabled,
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
      this.renderValue(this._richTextAggregate.richText);
      this.listToConfigEvent();

      this.removeGlobalUndoRedoEvent();
    });
  }

  private renderValue(richText: TeRichText): void {
    if (this.editor) {
      this.editor.isReady.then(() => {
        // if the destroy method was called
        if (this.destroyed) return;
        if (ClHelpService.isNullOrEmpty(richText)) {
          this.editor.clear();
        } else {
          if (this.firstInit) {
            this.editor.render(richText).then(() => {
              this.isLoaded$.next(true);

              this.event?.htmlIsInitiated();
              this.firstInit = false;
            });
          } else {
            this.editor.render(richText.toHTMLEditorJson());
          }
        }
      });
    }
  }

  printJson(): void {
    this.editor.save().then((data: any) => {
      console.log(data);
    });
  }

  private setCaret(index: number): void {
    if (index < 0) {
      index = 0;
    }

    if (index >= this.editor.blocks.getBlocksCount()) {
      index = this.editor.blocks.getBlocksCount() - 1;
    }

    this.editor.caret.setToBlock(index, 'end');
  }

  private listToConfigEvent(): void {
    const obs = this.event?.getEvent$();
    if (obs) {
      this.subscription = obs.subscribe((event) => {
        if (event.type === 'insertBlock') {
          this.editor?.blocks?.insert(event.blockType, event.data);
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

    const outputData: TeHTMLEditorJSON = await this.editor.save();
    // if the data is null, there was an error in the editor, don't emit the event
    // so the content is not cleared
    if (outputData == null) return;

    const newRichText = TeRichText.fromHTMLEditorJson(outputData);

    // check if outputData is different from the current value
    if (newRichText.contentAreEquals(this._richTextAggregate.richText)) return;

    // update the content and set the user as the current user
    this._richTextAggregate.updateContent(newRichText, 'current');

    this.textChange.emit(this._richTextAggregate.richText);
  }

  private async removeGlobalUndoRedoEvent(): Promise<void> {
    document.addEventListener('keydown', this.outsideUndoRedoListener);
  }

  private async checkKey(e: any): Promise<void> {
    // TODO: Faire une state pour la gestion de cet event quand il y a plusieurs text editor
    if ((e.metaKey || e.ctrlKey) && e.key == 'z') {
      e.preventDefault();
      await this.undoEvent(e);
    } else if ((e.metaKey || e.ctrlKey) && e.key == 'y') {
      e.preventDefault();
      await this.redoEvent(e);
    }
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
    this.subscription?.unsubscribe();
    document.removeEventListener('keydown', this.outsideUndoRedoListener);
  }
}
