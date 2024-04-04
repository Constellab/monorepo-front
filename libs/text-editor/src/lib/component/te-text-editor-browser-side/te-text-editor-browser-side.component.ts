import {
  ApplicationRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit, Optional,
  Output, Self,
  ViewChild
} from '@angular/core';
import {TeConfig} from '../../model/te-config.class';
import {TeRichText, TeRichTextContent} from '../../model/te-rich-text.class';
import {Observable} from 'rxjs';
import {EditorConfig} from '@editorjs/editorjs/types/configs/editor-config';
import {FlFormFieldDirective} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';


@Component({
  selector: 'te-text-editor-browser-side',
  templateUrl: './te-text-editor-browser-side.component.html',
  styleUrl: './te-text-editor-browser-side.component.scss',
})
export class TeTextEditorBrowserSideComponent extends FlFormFieldDirective<TeRichTextContent> implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

  @Input() placeholder: string = '';

  @HostBinding('class.g-text-editor-hide-toolbar')
  @Input() hideToolbar: boolean = false;

  /**
   * If true an inline padding is added to include the tooltip button in this component
   */
  @HostBinding('class.include-toolbar-button')
  @Input() includeToolbarButton: boolean = false;

  @Output() textChange: EventEmitter<TeRichTextContent> = new EventEmitter<TeRichTextContent>();

  @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef<HTMLElement>;

  editor: any | null;

  constructor(
    @Optional() @Self() ngControl: NgControl,
    private envInjector: EnvironmentInjector,
    private applicationRef: ApplicationRef) {
    super(ngControl);
  }

  async ngOnInit(): Promise<void> {
    setTimeout(async () => {
      import('@editorjs/editorjs').then((module) => {
        this.initEditor(module);
      });
    }, 0);
  }

  callChangeEvent(value: TeRichTextContent): void {
    this.textChange.emit(value);
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
    console.log('WRITE', obj, obj == this.value)
    if (this.value == obj) return;

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
    console.log('INIT', this.value)
    const config: EditorConfig = {
      placeholder: this.placeholder,
      holder: this.editorContainer.nativeElement,
      data: this.value,
      // set order for the inline tools
      inlineToolbar: this.config.getInlineToolbar(),
      readOnly: this.disabled,
      tools: this.config.getTools(this.envInjector, this.applicationRef),
      onChange: () => this.onTextEditorChange(),
      defaultBlock: this.config.getDefaultBlock(),
      tunes: this.config.getTunes()
    };
    this.editor = new module.default(config);
    console.log('EDITOR', this.editor)
  }

  private async onTextEditorChange(): Promise<void> {
    // the save method can be called only if the editor is not in readOnly mode
    if (!this.editor?.readOnly || this.editor.readOnly.isEnabled) return;

    const outputData = await this.editor.save();
    this.setAndEmitValue(outputData);
  }

  ngOnDestroy(): void {
    if (this.editor && this.editor.destroy) {
      this.editor.destroy();
    }
  }


}
