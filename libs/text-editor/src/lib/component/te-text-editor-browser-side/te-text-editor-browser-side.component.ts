import {
  ApplicationRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {TeConfig} from '../../model/te-config.class';
import {TeRichText, TeRichTextContent, TeRichTextUndoRedoResult} from '../../model/te-rich-text.class';
import {Subject, Subscription} from 'rxjs';
import {EditorConfig} from '@editorjs/editorjs/types/configs/editor-config';
import {FlKeyboardHelper, FlKeyboardKey, FlTranslateService} from '@monorepo/front-core-lib';
import {teGetI18nConfig} from '../../te-text-editor.i18n';
import {TeMention} from '../../plugin/te-mention.class';
import {ClHelpService} from '@monorepo/core-lib';
import {TeEmoji} from '../../plugin/te-emoji.class';
import {
  TeTextEditorHistoryModificationGroup,
  TeTextEditorHistoryModificationType
} from '../../model/te-text-editor-history-modification.class';
import {TeEvent} from '../../model/te-event.class';


@Component({
  selector: 'te-text-editor-browser-side',
  templateUrl: './te-text-editor-browser-side.component.html',
  styleUrl: './te-text-editor-browser-side.component.scss',
})
export class TeTextEditorBrowserSideComponent implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

  @Input() event: TeEvent;

  @Input() placeholder: string;

  @Output() textChange: EventEmitter<TeRichTextContent> = new EventEmitter<TeRichTextContent>();

  @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef<HTMLElement>;

  @Input({required: true}) set value(value: TeRichTextContent) {
    // check if value has changed to avoid circular updates
    if (TeRichText.contentAreEquals(value, this._value)) return;
    this._value = value;
    this.renderValue(value);
  }

  private _value: TeRichTextContent;

  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.onDisableChange(this._disabled);
  }

  private _disabled: boolean = false;

  private editor: any | null;

  private oldValue: TeRichTextContent;

  private isUndoRedo = false;

  private modificationGroup: TeTextEditorHistoryModificationGroup;

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

  constructor(private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef,
              private translateService: FlTranslateService,
              private renderer2: Renderer2) {
  }

  async ngOnInit(): Promise<void> {
    this.hideToolbar = this.config.uiConfig.hideToolbar;
    this.includeToolbarButton = this.config.uiConfig.includeToolbarButton;

    // enable emoji picker globally
    this.editorContainer.nativeElement.addEventListener('keypress',
      (event: KeyboardEvent) => {
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
    event.preventDefault()
    event.stopPropagation()

    if (this.oldValue != null && this.modificationGroup?.modifications?.length > 0 && !this.isUndoRedo) {
      const undoResult: TeRichTextUndoRedoResult = TeRichText.undoModification(this._value, this.modificationGroup);

      if (undoResult == null) {
        return;
      }

      switch (undoResult.modificationType) {
        case TeTextEditorHistoryModificationType.CREATED:
          this.editor.blocks.delete(undoResult.index);
          this.setCaret(undoResult.index - 1);
          break;
        case TeTextEditorHistoryModificationType.DELETED:
          if (this.editor.blocks.getById(undoResult.block.id) != null) {
            this.editor.blocks.delete(this.editor.blocks.getBlockIndex(undoResult.block.id));
          }
          this.editor.blocks.insertMany([undoResult.block], undoResult.index);
          this.setCaret(undoResult.index);
          break;
        case TeTextEditorHistoryModificationType.UPDATED:
          this.editor.blocks.insertMany([undoResult.block], undoResult.index);
          this.editor.blocks.delete(undoResult.index + 1);
          break;
        case TeTextEditorHistoryModificationType.MOVED:
          this.editor.blocks.move(undoResult.oldIndex, undoResult.index);
          this.setCaret(undoResult.oldIndex);
          break;
      }

      this.modificationGroup = undoResult.modificationsGroup;
      this.isUndoRedo = true;
      await this.onTextEditorChange();
    }
  }

  async redoEvent(event: Event): Promise<void> {
    event.preventDefault()
    event.stopPropagation()

    if (this.oldValue != null && this.modificationGroup?.modifications?.length > 0 && !this.isUndoRedo) {
      const redoResult: TeRichTextUndoRedoResult = TeRichText.redoModification(this._value, this.modificationGroup);

      if (redoResult == null) {
        return;
      }

      switch (redoResult.modificationType) {
        case TeTextEditorHistoryModificationType.CREATED:
          if (this.editor.blocks.getById(redoResult.block.id) != null) {
            this.editor.blocks.delete(this.editor.blocks.getBlockIndex(redoResult.block.id));
          }
          this.editor.blocks.insertMany([redoResult.block], redoResult.index);
          this.setCaret(redoResult.index);
          break;
        case TeTextEditorHistoryModificationType.DELETED:
          this.editor.blocks.delete(redoResult.index);
          this.setCaret(redoResult.index - 1);
          break;
        case TeTextEditorHistoryModificationType.UPDATED:
          this.editor.blocks.insertMany([redoResult.block], redoResult.index);
          this.editor.blocks.delete(redoResult.index + 1);
          break;
        case TeTextEditorHistoryModificationType.MOVED:
          this.editor.blocks.move(redoResult.index, redoResult.oldIndex);
          this.setCaret(redoResult.index);
          break;
      }

      this.modificationGroup = redoResult.modificationsGroup;
      this.isUndoRedo = true;
      await this.onTextEditorChange();
    }

  }

  private async initEditor(module: any): Promise<void> {
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
      // render the value here and not in the editor config
      // because if the editor config is initialized with data
      // a blank line is added
      this.renderValue(this._value);
      this.listToConfigEvent();

      this.removeGlobalUndoRedoEvent();
    });
  }

  private renderValue(value: TeRichTextContent): void {
    if (this.editor) {
      this.editor.isReady.then(() => {
        if (ClHelpService.isNullOrEmpty(value)) {
          this.editor.clear();
        } else {
          if (this.firstInit) {
            this.editor.render(value).then(() => {

              this.isLoaded$.next(true);

              this.event?.htmlIsInitiated();
              this.firstInit = false;

            });
          } else {
            this.editor.render(value);
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
    // the save method can be called only if the editor is not in readOnly mode
    if (!this.editor?.readOnly || this.editor.readOnly.isEnabled) return;
    const outputData: TeRichTextContent = await this.editor.save();
    // if the data is null, there was an error in the editor, don't emit the event
    // so the content is not cleared
    if (outputData == null) return;

    if (!this.isUndoRedo) {
      this.oldValue = this._value;
      this.modificationGroup = TeRichText.getRichTextModification(this.oldValue, outputData, 'current', this.modificationGroup);
    }

    // check if outputData is different from the current value
    if (TeRichText.contentAreEquals(outputData, this._value) && !this.isUndoRedo) return;

    this.isUndoRedo = false;
    this._value = outputData;
    this.textChange.emit(outputData);
  }

  private async removeGlobalUndoRedoEvent(): Promise<void> {
    document.addEventListener('keydown', this.outsideUndoRedoListener);
  }

  private async checkKey(e: any): Promise<void> {
    if ((e.metaKey || e.ctrlKey) && e.key == 'z') {
      e.preventDefault();
      await this.undoEvent(e);
    } else if ((e.metaKey || e.ctrlKey) && e.key == 'y') {
      e.preventDefault();
      await this.redoEvent(e);
    }
  }

  ngOnDestroy(): void {
    if (this.editor && this.editor.destroy) {
      this.editor.destroy();
    }
    this.isLoaded$.complete();
    this.subscription?.unsubscribe();
    document.removeEventListener('keydown', this.outsideUndoRedoListener);
  }

}
