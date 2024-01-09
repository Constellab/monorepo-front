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
  Optional,
  Output,
  Self,
  ViewChild
} from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import {TeConfig} from '../../model/te-config.class';
import {FlFormFieldDirective} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';
import {TeRichText, TeRichTextContent} from '../../model/te-rich-text.class';

@Component({
  selector: 'te-text-editor',
  templateUrl: './te-text-editor.component.html',
  styleUrl: './te-text-editor.component.scss',
})
export class TeTextEditorComponent extends FlFormFieldDirective<TeRichTextContent> implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

  @Input() placeholder: string = '';

  @HostBinding('class.g-text-editor-hide-toolbar')
  @Input() hideToolbar: boolean = false;

  @Output() textChange: EventEmitter<TeRichTextContent> = new EventEmitter<TeRichTextContent>();

  @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef<HTMLElement>;


  editor: EditorJS;

  constructor(@Optional() @Self() ngControl: NgControl,
              private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef) {
    super(ngControl);
  }

  ngOnInit(): void {

    this.editor = new EditorJS({
      placeholder: this.placeholder,
      holder: this.editorContainer.nativeElement,
      data: this.value,
      // set order for the inline tools
      inlineToolbar: this.config.getInlineToolbar(),
      readOnly: this.disabled,
      tools: this.config.getTools(this.envInjector, this.applicationRef),
      onChange: () => this.onTextEditorChange(),
      defaultBlock: this.config.getDefaultBlock(),
    });
  }

  private async onTextEditorChange(): Promise<void> {
    // the save method can be called only if the editor is not in readOnly mode
    if (this.editor.readOnly.isEnabled) return;
    const outputData = await this.editor.save();
    return this.setAndEmitValue(outputData);
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

  printJson(): void {
    this.editor.save().then((content: TeRichTextContent) => {
      console.log('Article data: ', content);
    });
  }

  setSavedData(): void {
    this.editor.save().then((content: TeRichTextContent) => {
      this.editor.render(content);
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
