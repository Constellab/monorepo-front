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
import {Observable} from 'rxjs';
import {EditorConfig} from '@editorjs/editorjs/types/configs/editor-config';
import {FlTranslateService} from '@monorepo/front-core-lib';
import {teGetI18nConfig} from '../../te-text-editor.i18n';
import EditorJS from '@editorjs/editorjs';


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

  constructor(private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef,
              private translateService: FlTranslateService) {
  }

  async ngOnInit(): Promise<void> {
    this.disabled$.subscribe((disabled: boolean) => {
      this.disabled = disabled;
      this.onDisableChange(this.disabled)
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
      this.editor.isReady.then(() => {
        if (obj) {
          this.editor.render(obj);
        } else {
          this.editor.clear();
        }
      });
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
      i18n: teGetI18nConfig(this.translateService)
    };
    this.editor = new module.default(config);
    if(this.value){
      this.editor.isReady.then(() => {
        this.editor.render(this.value);
      });
    }
  }

  private async onTextEditorChange(): Promise<void> {
    // the save method can be called only if the editor is not in readOnly mode
    if (!this.editor?.readOnly || this.editor.readOnly.isEnabled) return;
    const outputData = await this.editor.save();
    return this.textChange.emit(outputData);
  }

  ngOnDestroy(): void {
    if (this.editor && this.editor.destroy) {
      this.editor.destroy();
    }
  }


}
