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
  ViewChild
} from '@angular/core';
import {TeConfig} from '../../model/te-config.class';
import {TeRichText, TeRichTextContent} from '../../model/te-rich-text.class';
import {Observable, Subject} from 'rxjs';
import {EditorConfig} from '@editorjs/editorjs/types/configs/editor-config';
import {FlKeyboardHelper, FlKeyboardKey, FlTranslateService} from '@monorepo/front-core-lib';
import {teGetI18nConfig} from '../../te-text-editor.i18n';
import {TeMention} from '../../plugin/te-mention.class';
import {ClHelpService} from '@monorepo/core-lib';
import {TeEmoji} from '../../plugin/te-emoji.class';


@Component({
  selector: 'te-text-editor-browser-side',
  templateUrl: './te-text-editor-browser-side.component.html',
  styleUrl: './te-text-editor-browser-side.component.scss',
})
export class TeTextEditorBrowserSideComponent implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

  @Input() placeholder: string;

  @HostBinding('class.g-text-editor-hide-toolbar')
  @Input() hideToolbar: boolean = false;

  /**
   * If true an inline padding is added to include the tooltip button in this component
   */
  @HostBinding('class.include-toolbar-button')
  @Input() includeToolbarButton: boolean = false;

  @Output() textChange: EventEmitter<TeRichTextContent> = new EventEmitter<TeRichTextContent>();

  @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef<HTMLElement>;

  @Input() value: TeRichTextContent;

  @Input() disabled$: Observable<boolean>;

  @Input() value$: Observable<TeRichTextContent>;

  @Input()
  disabled: boolean = false;

  editor: any | null;

  isLoaded$: Subject<boolean> = new Subject<boolean>();

  constructor(private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef,
              private translateService: FlTranslateService) {
  }

  async ngOnInit(): Promise<void> {
    // enable emoji picker globally
    this.editorContainer.nativeElement.addEventListener('keypress',
      (event: KeyboardEvent) => {
        // use a time to let the character be added to the text
        setTimeout(() => {
          const additionalConfig = this.config.getAdditionalConfig();
          if (event.key === FlKeyboardKey.COLON && additionalConfig.emoji) {
            const emoji = new TeEmoji(event);
            emoji.openEmojiPicker();
          } else if (FlKeyboardHelper.keypressIsAt(event.key) && this.config.getAdditionalConfig().mention) {
            const mention = new TeMention(this.config.getAdditionalConfig().mention, event);
            mention.openMentionPortal();
          }
        }, 0);
      });

    this.disabled$.subscribe((disabled: boolean) => {
      this.disabled = disabled;
      this.onDisableChange(this.disabled);
    });

    this.value$.subscribe((value: TeRichTextContent) => {
      this.writeValue(value);
    });

    setTimeout(async () => {
      import('@editorjs/editorjs').then((module) => {
        this.initEditor(module);
      });
    }, 0);
  }

  onDisableChange(disable: boolean): void {
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

  writeValue(obj: TeRichTextContent): void {
    if (this.editor) {
      this.editor.isReady.then(() => this.renderValue(obj));
    }

    if (obj == null) {
      obj = TeRichText.emptyContent();
    }
    this.value = obj;
  }

  private async initEditor(module: any): Promise<void> {
    const config: EditorConfig = {
      placeholder: this.placeholder ?? this.translateService.translate('teTextEditor.placeholder'),
      holder: this.editorContainer.nativeElement,
      data: this.value,
      // set order for the inline tools
      inlineToolbar: this.config.getInlineToolbar(),
      readOnly: this.disabled,
      tools: this.config.getTools(this.envInjector, this.applicationRef),
      onChange: () => this.onTextEditorChange(),
      defaultBlock: this.config.getDefaultBlock(),
      tunes: this.config.getTunes(),
      i18n: teGetI18nConfig(this.translateService),
    };
    this.editor = new module.default(config);
    if (this.value) {
      this.editor.isReady.then(() => {
        this.renderValue(this.value);
        this.isLoaded$.next(true);
      });
    }
  }

  private renderValue(value: TeRichTextContent): void {
    if (ClHelpService.isNullOrEmpty(value)) {
      this.editor.clear();
    } else {
      this.editor.render(value);
    }
  }

  private async onTextEditorChange(): Promise<void> {
    // the save method can be called only if the editor is not in readOnly mode
    if (!this.editor?.readOnly || this.editor.readOnly.isEnabled) return;
    const outputData = await this.editor.save();
    // if the data is null, there was an error in the editor, don't emit the event
    // so the content is not cleared
    if (outputData == null) return;
    return this.textChange.emit(outputData);
  }

  printJson(): void {
    this.editor.save().then((data: any) => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    if (this.editor && this.editor.destroy) {
      this.editor.destroy();
    }
    this.isLoaded$.complete();
  }


}
