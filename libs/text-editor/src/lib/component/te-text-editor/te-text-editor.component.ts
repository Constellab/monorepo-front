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
import EditorJS, {API, OutputData} from '@editorjs/editorjs';
import {TeConfig} from '../../model/te-config.class';
import {FlFormFieldDirective} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';

@Component({
  selector: 'te-text-editor',
  templateUrl: './te-text-editor.component.html',
  styleUrl: './te-text-editor.component.scss',
})
export class TeTextEditorComponent extends FlFormFieldDirective<OutputData> implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

  @Input() placeholder: string = '';

  @Output() textChange: EventEmitter<OutputData> = new EventEmitter<OutputData>();

  @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef<HTMLElement>;

  editor: EditorJS;

  constructor(@Optional() @Self() ngControl: NgControl,
              private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef) {
    super(ngControl);
  }

  ngOnInit(): void {


    this.value = {
      time: 1703676274906,
      blocks: [
        {
          id: '-JiHr_aTiF',
          type: 'header',
          data: {text: 'SImple title', level: 2}
        },
        {id: 'EeX4cgOEbn', type: 'paragraph', data: {text: 'Text'}},
        // {
        //   id: 'EeX4cgOkjhEbn',
        //   type: 'hint',
        //   data: {hintType: 'info', content: '<p>Text</p><script>alert("A")</script>'}
        // },
        // {id: 'EeX4cgOEjhjbn', type: 'video', data:
        //     {url: 'https://www.youtube.com/embed/L2jNEUoHP0U', title: 'Tess', caption: 'kjhkjh'}},
        // {
        //   id: 'cCRXafezGG',
        //   type: 'formula',
        //   data: {formula: 'e=mc^2', title: 'Super', caption: 'THE caption'}
        // },
        // {
        //   id: 'cCRXafezGG',
        //   type: 'view',
        //   data: {
        //     caption: 'kjhkjhkj', experiment_id: '51925a2e-204f-4655-95e0-2438342643b9',
        //     id: 'f657e23c-2186-42e0-97fa-aa26d07a2f84_1703762058740',
        //     resource_id: '9abbabab-2c64-4bb1-8bfc-5ff33551d344',
        //     title: 'Table - Tabular kk',
        //     view_config: {
        //       from_row: 1,
        //       number_of_rows_per_page: 100,
        //       from_column: 1,
        //       number_of_columns_per_page: 250,
        //       replace_nan_by: 'empty'
        //     },
        //     view_method_name: 'view_as_table',
        //   }
        // }

        // {
        //   id: "kljlkj",
        //   type: 'figure',
        //   data: {
        //     filename: '809e8bcd-65ed-4e8a-9ba7-e14122967250_1703772439187.jpg',
        //     width: 371,
        //     height: 495,
        //     naturalHeight: 2048,
        //     naturalWidth: 1536,
        //     caption: 'Caption',
        //     title: 'Title'
        //   }

        {
          id: 'kljlkj',
          type: 'code',
          data: {
            language: 'python',
            code: `@classmethod
def get_and_call_view_on_resource_model(cls, resource_model_id: str,
                                            view_name: str, config_values: ConfigParamsDict,
                                            save_view_config: bool = False) -> CallViewResult:


        resource_model: ResourceModel = cls.get_resource_by_id(
            resource_model_id)
        return cls.call_view_on_resource_model(resource_model, view_name, config_values, save_view_config`
          }
        }
      ],
      version: '2.28.2'
    };


    this.editor = new EditorJS({
      placeholder: this.placeholder,
      holder: this.editorContainer.nativeElement,
      data: this.value,
      // set order for the inline tools
      inlineToolbar: this.config.getInlineToolbar(),
      readOnly: this.disabled,
      tools: this.config.getTools(this.envInjector, this.applicationRef),

      onChange: (api: API, event: any) => {
        this.editor.save().then((outputData: OutputData) => {
          this.setAndEmitValue(outputData);
        });
      }
    });

    // });
    // setTimeout(() => {
    //   this.editor.readOnly.toggle();
    // }, 3000);

    // this.editor.isReady.then(() => {
    // const a = this.editor;
    // console.log('Editor.js is ready to work!');
    //   new DragDrop(this.editor);
    // });
  }

  callChangeEvent(value: OutputData): void {
    this.textChange.emit(value);
  }

  onDisableChange(disable: boolean): void {
    if (!this.editor) return;
    if (disable !== this.editor.readOnly.isEnabled) {
      console.log('toggle read only');
      this.editor.readOnly.toggle();
    }
  }

  writeValue(obj: OutputData): void {
    if (this.editor) {
      this.editor.render(obj);
    }

    this.value = obj;
  }


  printJson(): void {
    this.editor.save().then((outputData: OutputData) => {
      console.log('Article data: ', outputData);
    });
  }

  setSavedData(): void {
    this.editor.save().then((outputData: OutputData) => {
      this.editor.render(outputData);
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
