import {
  ApplicationRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild
} from '@angular/core';
import EditorJS, {API} from '@editorjs/editorjs';
import {TeConfig} from '../../model/te-config.class';
import {FlFormFieldDirective} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';
import {TeTextEditorContent, TeTextEditorHelper} from '../../model/te-text-editor.class';

@Component({
  selector: 'te-text-editor',
  templateUrl: './te-text-editor.component.html',
  styleUrl: './te-text-editor.component.scss',
})
export class TeTextEditorComponent extends FlFormFieldDirective<TeTextEditorContent> implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

  @Input() placeholder: string = '';

  @Output() textChange: EventEmitter<TeTextEditorContent> = new EventEmitter<TeTextEditorContent>();

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

      onChange: (api: API, event: any) => {
        this.editor.save().then((content: TeTextEditorContent) => this.setAndEmitValue(content));
      },
      defaultBlock: 'paragraph'
    });
  }

  callChangeEvent(value: TeTextEditorContent): void {
    this.textChange.emit(value);
  }

  onDisableChange(disable: boolean): void {
    if (!this.editor) return;
    if (disable !== this.editor.readOnly.isEnabled) {
      this.editor.readOnly.toggle();
    }
  }

  writeValue(obj: TeTextEditorContent): void {
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
      obj = TeTextEditorHelper.emptyContent();
    }
    this.value = obj;
  }


  printJson(): void {
    this.editor.save().then((content: TeTextEditorContent) => {
      console.log('Article data: ', content);
    });
  }

  setSavedData(): void {
    this.editor.save().then((content: TeTextEditorContent) => {
      this.editor.render(content);
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
