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


//     this.value = {
//       time: 1703676274906,
//       blocks: [
//         {
//           id: '-JiHr_aTiF',
//           type: 'header',
//           data: {text: 'SImple title', level: 2}
//         },
//         {id: 'EeX4cgOEbn', type: 'paragraph', data: {text: 'Text'}},
//         // {
//         //   id: 'EeX4cgOkjhEbn',
//         //   type: 'hint',
//         //   data: {hintType: 'info', content: '<p>Text</p><script>alert("A")</script>'}
//         // },
//         // {id: 'EeX4cgOEjhjbn', type: 'video', data:
//         //     {url: 'https://www.youtube.com/embed/L2jNEUoHP0U', title: 'Tess', caption: 'kjhkjh'}},
//         // {
//         //   id: 'cCRXafezGG',
//         //   type: 'formula',
//         //   data: {formula: 'e=mc^2', title: 'Super', caption: 'THE caption'}
//         // },
//         // {
//         //   id: 'cCRXafezGG',
//         //   type: 'view',
//         //   data: {
//         //     caption: 'kjhkjhkj', experiment_id: '51925a2e-204f-4655-95e0-2438342643b9',
//         //     id: 'f657e23c-2186-42e0-97fa-aa26d07a2f84_1703762058740',
//         //     resource_id: '9abbabab-2c64-4bb1-8bfc-5ff33551d344',
//         //     title: 'Table - Tabular kk',
//         //     view_config: {
//         //       from_row: 1,
//         //       number_of_rows_per_page: 100,
//         //       from_column: 1,
//         //       number_of_columns_per_page: 250,
//         //       replace_nan_by: 'empty'
//         //     },
//         //     view_method_name: 'view_as_table',
//         //   }
//         // }
//
//         // {
//         //   id: "kljlkj",
//         //   type: 'figure',
//         //   data: {
//         //     filename: '809e8bcd-65ed-4e8a-9ba7-e14122967250_1703772439187.jpg',
//         //     width: 371,
//         //     height: 495,
//         //     naturalHeight: 2048,
//         //     naturalWidth: 1536,
//         //     caption: 'Caption',
//         //     title: 'Title'
//         //   }
//
//         {
//           id: 'kljlkj',
//           type: 'code',
//           data: {
//             language: 'python',
//             code: `@classmethod
// def get_and_call_view_on_resource_model(cls, resource_model_id: str,
//                                             view_name: str, config_values: ConfigParamsDict,
//                                             save_view_config: bool = False) -> CallViewResult:
//
//
//         resource_model: ResourceModel = cls.get_resource_by_id(
//             resource_model_id)
//         return cls.call_view_on_resource_model(resource_model, view_name, config_values, save_view_config`
//           }
//         }
//       ],
//       version: '2.28.2'
//     };


    //
    // caption
    //   :
    //   ""
    // filename
    //   :
    //   "619f70cd-6353-4150-9dba-f0ef126f5739_1704364201015.gif"
    // height
    //   :
    //   184
    // naturalHeight
    //   :
    //   184
    // naturalWidth
    //   :
    //   634
    // title
    //   :
    //   ""
    // width
    //   :
    //   634
    this.value = {
      'time': 1704300030508,
      'blocks': [
        {'id': 'Cnefmrb327', 'type': 'paragraph', 'data': {'text': 'uhuih'}},
        {
          id: 'EeX4cgOEbn',
          type: 'figure',
          data: {
            caption: '',
            filename: '619f70cd-6353-4150-9dba-f0ef126f5739_1704364201015.gif',
            height: 184,
            naturalHeight: 184,
            naturalWidth: 634,
            title: '',
            width: 634
          }
        },

      ],
      'version': '2.28.2'
    };

    // const quillJson: any ={
    //   "id": "3be4ac25-2591-417f-b246-26b5b5495281",
    //   "createdAt": "2023-03-06T09:21:07.000+00:00",
    //   "lastModifiedAt": "2023-11-02T14:19:56.000+00:00",
    //   "title": "Create your first task",
    //   "content": {
    //     "ops": [
    //       {
    //         "insert": "In this tutorial you will learn how to create and test a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Task"
    //       },
    //       {
    //         "insert": ". This required basic understanding of what a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Task"
    //       },
    //       {
    //         "insert": " is and what a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Resource"
    //       },
    //       {
    //         "insert": " is. \nPlease check the following link if you don't know what is a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Task"
    //       },
    //       {
    //         "insert": " : "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/task/task#write-unit-test"
    //         },
    //         "insert": "Task > what-is-a-task-?"
    //       },
    //       {
    //         "insert": "."
    //       },
    //       {
    //         "attributes": {
    //           "list": "bullet"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Please check the following link if your don't know what is a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Resource"
    //       },
    //       {
    //         "insert": " : "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/resource/resource#what-is-a-resource?"
    //         },
    //         "insert": "Resource > what-is-a-resource?"
    //       },
    //       {
    //         "insert": "."
    //       },
    //       {
    //         "attributes": {
    //           "list": "bullet"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "The goal of this tutorial is to create a simple task that apply a factor to all the data of a "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://hub.gencovery.com/bricks/gws_core/v0/doc/technical-folder/resource/Table/"
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": ". A "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " is one of the main "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Resource"
    //       },
    //       {
    //         "insert": " that represent a 2d array (it contains a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Dataframe"
    //       },
    //       {
    //         "insert": "). \n\n"
    //       },
    //       {
    //         "attributes": {
    //           "bold": true
    //         },
    //         "insert": "Let's do it"
    //       },
    //       {
    //         "insert": " 💪\nCreate your task "
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 2,
    //             "id": "create-your-task"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Specify your task"
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 3,
    //             "id": "specify-your-task"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "First, you need to create an empty task named "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TableFactor"
    //       },
    //       {
    //         "insert": " in the folder "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "src/gws_academy/tutorials/table_factor"
    //       },
    //       {
    //         "insert": ". To learn on how to create a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Task"
    //       },
    //       {
    //         "insert": ", please check the following link "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/task/task#how-to-create-a-task-?"
    //         },
    //         "insert": "Task > how-to-create-a-task-?"
    //       },
    //       {
    //         "insert": ".\nDefine an "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "input_specs"
    //       },
    //       {
    //         "insert": " named "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "input_table"
    //       },
    //       {
    //         "insert": " and an "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "output_specs"
    //       },
    //       {
    //         "insert": " named "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "output_table"
    //       },
    //       {
    //         "insert": ", both of type "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": "  . To learn about inputs and outputs, please check the following link "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/task/task#inputs-&-outputs"
    //         },
    //         "insert": "Task > inputs-&-outputs"
    //       },
    //       {
    //         "insert": ".\nDefine an "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "IntParam"
    //       },
    //       {
    //         "insert": " named "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "factor"
    //       },
    //       {
    //         "insert": " . The value of this parameters will be apply to the whole Dataframe. We use a parameter so a user will be available to configure it when he uses your task .To learn about the task configuration, please check the following link "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/task/task#configuration"
    //         },
    //         "insert": "Task > configuration"
    //       },
    //       {
    //         "insert": ".\nWrite the run method"
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 3,
    //             "id": "write-the-run-method"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Now all the specifications of your task are done you can write the task code . Define an empty run method like so (all the classes are imported from "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "gws_core"
    //       },
    //       {
    //         "insert": ")\ndef run(self, params: ConfigParams, inputs: TaskInputs) -> TaskOutputs:"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "    return {}"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Now to write the method, you will need to :\nretrieve the input "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "retrieve the config value"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "get the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Dataframe"
    //       },
    //       {
    //         "insert": " from the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " (use the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "get_data"
    //       },
    //       {
    //         "insert": " method)"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "apply the factor to the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Dataframe"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "create a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " with the new "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Dataframe"
    //       },
    //       {
    //         "insert": " ("
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table(my_dataframe)"
    //       },
    //       {
    //         "insert": ")"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "return the new "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " as output"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Check the link provided above to see how to work with inputs, outputs and configurations. Also check the exemple provided in the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "How to create a task ?"
    //       },
    //       {
    //         "insert": "  section"
    //       },
    //       {
    //         "attributes": {
    //           "hint": "info"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Test your task"
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 2,
    //             "id": "test-your-task"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Now that your task is written, we need to test it to check if it is working. \nCreate the test"
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 3,
    //             "id": "create-the-test"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Create an empty test named "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TestTableFactor"
    //       },
    //       {
    //         "insert": " in the folder "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "tests/table_factor"
    //       },
    //       {
    //         "insert": ". To learn about the unit test and how to create them, please check the following link "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/task/task#write-unit-test"
    //         },
    //         "insert": "Task > write-unit-test"
    //       },
    //       {
    //         "insert": ".\nCreate the async test method "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "test_table_folder"
    //       },
    //       {
    //         "insert": " .\nNow to write the test you will need to :\ncreate a simple "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " to test the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Task"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "create a "
    //       },
    //       {
    //         "attributes": {
    //           "bold": true,
    //           "code": true
    //         },
    //         "insert": "Dataframe : dataframe = DataFrame({'A': [0, 1, 2],'B': [9, 7, 5]})"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "create the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " from the "
    //       },
    //       {
    //         "attributes": {
    //           "bold": true,
    //           "code": true
    //         },
    //         "insert": "Dataframe : table = Table(dataframe)"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "create the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TaskRunner"
    //       },
    //       {
    //         "insert": " (see exemple in the link above)"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "provide the task type "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TableFactor"
    //       },
    //       {
    //         "insert": " to the task runner. You will have to import you "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TableFactor"
    //       },
    //       {
    //         "insert": " class : "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "from gws_academy.table_factor.task.table_factor import TableFactor"
    //       },
    //       {
    //         "insert": ". The import must be an absolute import (not a relative) because the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "tests"
    //       },
    //       {
    //         "insert": " folder is outside the scope of the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "gws_academy"
    //       },
    //       {
    //         "insert": " python package."
    //       },
    //       {
    //         "attributes": {
    //           "indent": 1,
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "provide the previously created "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " as input of the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TaskRunner"
    //       },
    //       {
    //         "insert": ". "
    //       },
    //       {
    //         "attributes": {
    //           "indent": 1,
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "provide the configuration value, let's use a factor of "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "2"
    //       },
    //       {
    //         "insert": "."
    //       },
    //       {
    //         "attributes": {
    //           "indent": 1,
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "execute the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TaskRunner"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "retrieve the output "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "manually create the expected table to compare it to the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "TaskRunner"
    //       },
    //       {
    //         "insert": " result. Create a "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " from the Dataframe : "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "DataFrame({'A': [0, 2, 4],'B': [18, 14, 10]})"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Compare the two "
    //       },
    //       {
    //         "attributes": {
    //           "bold": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " using an assert function : "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "self.assertTrue(result_table.equals(expected_table))"
    //       },
    //       {
    //         "attributes": {
    //           "list": "ordered"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "And that's it your test is done 🍾! You can run it to check if everything is working.\nHere is the complete example\ndef test_table_factor(self):"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        # create the input table"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        dataframe = DataFrame({'A': [0, 1, 2], 'B': [9, 7, 5]})"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        table = Table(dataframe)"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n\n"
    //       },
    //       {
    //         "insert": "        # create and configure task runner"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        tester = TaskRunner("
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "            task_type=TableFactor,"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "            inputs={'input_table': table},"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "            params={'factor': 2},"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        )"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n\n"
    //       },
    //       {
    //         "insert": "        # run the task and retrieve the outputs"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        outputs = tester.run()"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n\n"
    //       },
    //       {
    //         "insert": "        # get the output table"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        result_table: Table = outputs['output_table']"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n\n"
    //       },
    //       {
    //         "insert": "        # create the expected table"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        expected_dataframe = DataFrame({'A': [0, 2, 4], 'B': [18, 14, 10]})"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        expected_table = Table(expected_dataframe)"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n\n"
    //       },
    //       {
    //         "insert": "        # compare the output table with the expected table"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "        self.assertTrue(result_table.equals(expected_table))"
    //       },
    //       {
    //         "attributes": {
    //           "code-block": true
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Run the test"
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 3,
    //             "id": "run-the-test"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "To know how to execute and debug a test, check the following link : "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/dev-environment/getting-started"
    //         },
    //         "insert": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/dev-environment/getting-started"
    //       },
    //       {
    //         "insert": "\nWhen you click on the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Run single file"
    //       },
    //       {
    //         "insert": " button, enter your brick name and your test file run to run the test : "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "gws_academy/test_table_factor"
    //       },
    //       {
    //         "insert": ".\nYou test will then run and if you have errors, please fix them. If you test was ok you should see a similar message than the photo bellow. \n"
    //       },
    //       {
    //         "insert": {
    //           "figure": {
    //             "filename": "3be4ac25-2591-417f-b246-26b5b5495281/images/f5852af2-c6ac-4b8d-8cc0-153ff4326b0e_1665043486727.7bc3d492-42a6-4296-961d-1a8d0ff4b9fd",
    //             "width": 945,
    //             "height": 182,
    //             "naturalWidth": 945,
    //             "naturalHeight": 182,
    //             "title": "",
    //             "caption": ""
    //           }
    //         }
    //       },
    //       {
    //         "insert": "Check your task with the pre-written test. "
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 2,
    //             "id": "check-your-task-with-the-pre-written-test"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "In the "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "gws_academy"
    //       },
    //       {
    //         "insert": " brick we wrote a test file that you should execute to see if you task was correctly developed. It could also help you to see how to write a clean test. The test file is available at "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "tests/solutions/test_so_table_factor.py"
    //       },
    //       {
    //         "insert": ".\nYou can run the test the same way your run your own test, the file name is "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "test_so_table_factor"
    //       },
    //       {
    //         "insert": ", here is the complete input to run the test: "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "gws_academy/test_so_table_factor"
    //       },
    //       {
    //         "insert": ". \nTo run your test, you will need to use the run option from VsCode, you can't execute the python file directly. Please refer to : "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/dev-environment/getting-started#run-a-test-file"
    //         },
    //         "insert": "https://constellab.community/bricks/gws_core/latest/doc/developer-guide/dev-environment/getting-started#run-a-test-file"
    //       },
    //       {
    //         "attributes": {
    //           "hint": "info"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "If this test ends up in success, it means you correctly wrote you task and your Test, "
    //       },
    //       {
    //         "attributes": {
    //           "bold": true
    //         },
    //         "insert": "CONGRATULATION"
    //       },
    //       {
    //         "insert": ", you’re done with this tutorial!\nIf this test ends up in error, it means 2 things: \nyour task was not implemented correctly "
    //       },
    //       {
    //         "attributes": {
    //           "list": "bullet"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "please check the class name and the name of your input, output and configuration, they must match the names provided in the tutorial. "
    //       },
    //       {
    //         "attributes": {
    //           "indent": 1,
    //           "list": "bullet"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "your test was not written correctly because your test should have ended up in error and not success. "
    //       },
    //       {
    //         "attributes": {
    //           "bold": true
    //         },
    //         "insert": "It means that your test is not correctly testing your task"
    //       },
    //       {
    //         "insert": ". "
    //       },
    //       {
    //         "attributes": {
    //           "list": "bullet"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Test your task in the interface"
    //       },
    //       {
    //         "attributes": {
    //           "header": {
    //             "level": 2,
    //             "id": "test-your-task-in-the-interface"
    //           }
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "Now that your task is ready to be used, you can test it in real conditions. Start your lab in dev mode : "
    //       },
    //       {
    //         "attributes": {
    //           "link": "https://constellab.community/tech-doc/doc/developer-guide/dev-environment/getting-started#start-dev-server"
    //         },
    //         "insert": "https://constellab.community/tech-doc/doc/developer-guide/dev-environment/getting-started#start-dev-server"
    //       },
    //       {
    //         "insert": " \nPlease check the logs when starting the dev server. Their might be warning or error when you are developing a brick. Those are helpful to understand what it going on. You can also check in the Monitoring section of the lab if all the bricks were loaded correctly. "
    //       },
    //       {
    //         "attributes": {
    //           "hint": "warning"
    //         },
    //         "insert": "\n"
    //       },
    //       {
    //         "insert": "In dev mode, upload a csv file and import it as "
    //       },
    //       {
    //         "attributes": {
    //           "code": true
    //         },
    //         "insert": "Table"
    //       },
    //       {
    //         "insert": " so it can be used as input of our task. Create an experiment and add the task to it. Plug your imported table as input and add and output to the task. \n\n\n\n\n"
    //       }
    //     ]
    //   },
    //   "path": "create-your-first-task",
    //   "completePath": "tutorials/create-your-first-task/",
    //   "order": 1,
    //   "folder": {
    //     "id": "f453dad5-f8e9-48f7-9ebc-88fdb31e1e46",
    //     "createdAt": "2023-03-06T09:20:55.000+00:00",
    //     "lastModifiedAt": "2023-05-10T07:23:02.000+00:00",
    //     "title": "Tutorials",
    //     "path": "tutorials",
    //     "completePath": "tutorials/",
    //     "order": 2,
    //     "brickMajorVersion": {
    //       "id": "2c6b4ae8-37d2-4899-89b0-b7b8f1cb03ff",
    //       "createdAt": "2022-03-09T14:56:27.000+00:00",
    //       "lastModifiedAt": "2022-03-09T14:56:27.000+00:00",
    //       "major": 0,
    //       "versionState": "LATEST",
    //       "createdBy": {
    //         "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //         "firstname": "Benjamin",
    //         "lastname": "Maisonneuve",
    //         "email": "bmaisonneuve@gencovery.com",
    //         "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //         "category": "ADMIN",
    //         "createdAt": "2022-02-02T14:11:26.000+00:00",
    //         "lang": "en",
    //         "theme": "dark-theme"
    //       },
    //       "lastModifiedBy": {
    //         "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //         "firstname": "Benjamin",
    //         "lastname": "Maisonneuve",
    //         "email": "bmaisonneuve@gencovery.com",
    //         "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //         "category": "ADMIN",
    //         "createdAt": "2022-02-02T14:11:26.000+00:00",
    //         "lang": "en",
    //         "theme": "dark-theme"
    //       },
    //       "brick": {
    //         "id": "b63530c2-ecc6-44ea-a4c5-8037ddf8644d",
    //         "name": "gws_core",
    //         "description": "Core provides libraries used by any  brick in Contellab\n",
    //         "isCertified": false,
    //         "visibility": "public",
    //         "pipRepo": "",
    //         "gitRepo": "https://gitlab.com/constellab/core/gws_core.git",
    //         "imageLink": "https://storage.sbg.cloud.ovh.net/v1/AUTH_a0286631d7b24afba3f3cdebed2992aa/public/CORE.png",
    //         "credentialUsername": "gws_core-reader",
    //         "credentialPassword": "glpat-2WbFTSeYaqxNxrJrBsWi",
    //         "createdAt": "2022-03-09T14:56:27.000+00:00",
    //         "lastModifiedAt": "2023-04-19T09:35:41.000+00:00",
    //         "brickUsers": [],
    //         "createdBy": {
    //           "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //           "firstname": "Benjamin",
    //           "lastname": "Maisonneuve",
    //           "email": "bmaisonneuve@gencovery.com",
    //           "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //           "category": "ADMIN",
    //           "createdAt": "2022-02-02T14:11:26.000+00:00",
    //           "lang": "en",
    //           "theme": "dark-theme"
    //         },
    //         "lastModifiedBy": {
    //           "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //           "firstname": "Benjamin",
    //           "lastname": "Maisonneuve",
    //           "email": "bmaisonneuve@gencovery.com",
    //           "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //           "category": "ADMIN",
    //           "createdAt": "2022-02-02T14:11:26.000+00:00",
    //           "lang": "en",
    //           "theme": "dark-theme"
    //         }
    //       }
    //     },
    //     "createdBy": {
    //       "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //       "firstname": "Benjamin",
    //       "lastname": "Maisonneuve",
    //       "email": "bmaisonneuve@gencovery.com",
    //       "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //       "category": "ADMIN",
    //       "createdAt": "2022-02-02T14:11:26.000+00:00",
    //       "lang": "en",
    //       "theme": "dark-theme"
    //     },
    //     "lastModifiedBy": {
    //       "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //       "firstname": "Benjamin",
    //       "lastname": "Maisonneuve",
    //       "email": "bmaisonneuve@gencovery.com",
    //       "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //       "category": "ADMIN",
    //       "createdAt": "2022-02-02T14:11:26.000+00:00",
    //       "lang": "en",
    //       "theme": "dark-theme"
    //     }
    //   },
    //   "createdBy": {
    //     "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //     "firstname": "Benjamin",
    //     "lastname": "Maisonneuve",
    //     "email": "bmaisonneuve@gencovery.com",
    //     "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //     "category": "ADMIN",
    //     "createdAt": "2022-02-02T14:11:26.000+00:00",
    //     "lang": "en",
    //     "theme": "dark-theme"
    //   },
    //   "lastModifiedBy": {
    //     "id": "385a5644-0b35-41fb-8613-becfdefa4b72",
    //     "firstname": "Benjamin",
    //     "lastname": "Maisonneuve",
    //     "email": "bmaisonneuve@gencovery.com",
    //     "photo": "7acd4896-2e92-4985-a548-3da0d74fe65b_1665070176250.png",
    //     "category": "ADMIN",
    //     "createdAt": "2022-02-02T14:11:26.000+00:00",
    //     "lang": "en",
    //     "theme": "dark-theme"
    //   }
    // };
    //
    //
    // const migeator = new TeQuillMigrator(quillJson.content);
    //
    // this.value = migeator.migrate();

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
      },
      defaultBlock: 'paragraph'
    });

    // setTimeout(() => {
    //
    //   this.editor.render(this.value);
    // }, 3000);

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
