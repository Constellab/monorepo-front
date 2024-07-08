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
import { TeConfig } from '../../model/te-config.class';
import { TeRichText, TeRichTextContent } from '../../model/te-rich-text.class';
import { Subject, Subscription } from 'rxjs';
import { EditorConfig } from '@editorjs/editorjs/types/configs/editor-config';
import { FlKeyboardHelper, FlKeyboardKey, FlTranslateService } from '@monorepo/front-core-lib';
import { teGetI18nConfig } from '../../te-text-editor.i18n';
import { TeMention } from '../../plugin/te-mention.class';
import { ClHelpService } from '@monorepo/core-lib';
import { TeEmoji } from '../../plugin/te-emoji.class';


@Component({
  selector: 'te-text-editor-browser-side',
  templateUrl: './te-text-editor-browser-side.component.html',
  styleUrl: './te-text-editor-browser-side.component.scss',
})
export class TeTextEditorBrowserSideComponent implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

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

  private subscription: Subscription;

  isLoaded$: Subject<boolean> = new Subject<boolean>();

  @HostBinding('class.g-text-editor-hide-toolbar')
  hideToolbar: boolean = false;

  @HostBinding('class.include-toolbar-button')
  includeToolbarButton: boolean = false;

  constructor(private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef,
              private translateService: FlTranslateService) {
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
      this.isLoaded$.next(true);
      // render the value here and not in the editor config
      // because if the editor config is initialized with data
      // a blank line is added
      this.renderValue(this._value);
      this.listToConfigEvent();
    });
  }

  private renderValue(value: TeRichTextContent): void {
    if (this.editor) {
      this.editor.isReady.then(() => {
        if (ClHelpService.isNullOrEmpty(value)) {
          this.editor.clear();
        } else {
          this.editor.render(value);
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

    // check if outputData is different from the current value
    if (TeRichText.contentAreEquals(outputData, this._value)) return;

    this._value = outputData;
    this.textChange.emit(outputData);
  }

  private listToConfigEvent(): void {
    const obs = this.config.getEvent$();
    if (obs) {
      this.subscription = obs.subscribe((event) => {
        if (event.type === 'insertBlock') {
          this.editor?.blocks?.insert(event.blockType, event.data);
        }
      });
    }
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
    this.subscription?.unsubscribe();
  }


}
