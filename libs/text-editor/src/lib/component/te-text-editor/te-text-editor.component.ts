import {ApplicationRef, Component, ElementRef, EnvironmentInjector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import EditorJS, {OutputData} from '@editorjs/editorjs';
import Header from '@editorjs/header';
import NestedList from '@editorjs/nested-list';
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Quote from '@editorjs/quote';
import Underline from '@editorjs/underline';
import Strikethrough from '@sotaproject/strikethrough';
import {TeFormulaBlock} from '../../block/te-formula-block.class';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
import {TeTextEditorState} from '../../model/te-text-editor.state';
import {teComponentBlockFactory} from '../../block/te-component-block.class';

@Component({
  selector: 'te-text-editor',
  templateUrl: './te-text-editor.component.html',
  styleUrl: './te-text-editor.component.scss',
})
export class TeTextEditorComponent implements OnInit, OnDestroy {

  @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef<HTMLElement>;

  editor: EditorJS;
  state: TeTextEditorState;

  constructor(private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef) {
  }

  ngOnInit(): void {


    const data: OutputData = {
      time: 1703676274906,
      blocks: [{
        id: '-JiHr_aTiF',
        type: 'header',
        'data': {text: 'SImple title', level: 2}
      }, {id: 'EeX4cgOEbn', type: 'paragraph', data: {text: 'Text'}}, {
        id: 'cCRXafezGG',
        type: 'formula',
        data: {formula: 'e=mc^2', title: 'Super', caption: 'THE caption'}
      }],
      version: '2.28.2'
    };


    const aa = teComponentBlockFactory(TeFormulaBlock, this.envInjector, this.applicationRef)
    this.editor = new EditorJS({
      holder: this.editorContainer.nativeElement,
      data: data,
      // set order for the inline tools
      inlineToolbar: ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode'],
      // readOnly: true,
      tools: {
        underline: Underline,
        strikethrough: Strikethrough,
        header: {
          class: Header as any,
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4],
            defaultLevel: 2
          },
          toolbox: [
            {
              icon: 'H2', // icon for H2,
              title: 'Heading 2',
              data: {
                level: 2,
              },
            },
            {
              icon: 'H3', // icon for H3,
              title: 'Heading 3',
              data: {
                level: 3,
              },
            },
            {
              icon: 'H4',// icon for H1,
              title: 'Heading 4',
              data: {
                level: 4,
              },
            }
          ]
        },
        list: {
          class: NestedList,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          },
        },
        code: CodeTool,
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
        },
        formula: {
          class: aa,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
              byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
            }
          }
        },
        table: Table,
      }
    });
    // });
    // setTimeout(() => {
    //   this.editor.readOnly.toggle();
    // }, 3000);


    // this.state = new TeTextEditorState(this.editor, this.editorContainer.nativeElement, false);
    // this.managerState.registerTextEditor(this.elementRef.nativeElement, this.state);

    // this.editor.isReady.then(() => {
    // const a = this.editor;
    // console.log('Editor.js is ready to work!');
    //   new DragDrop(this.editor);
    // });
  }

  printJson(): void {
    this.editor.save().then((outputData) => {
      console.log('Article data: ', outputData);
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
