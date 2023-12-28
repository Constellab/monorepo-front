import {ApplicationRef, Component, ElementRef, EnvironmentInjector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import EditorJS, {OutputData} from '@editorjs/editorjs';
import NestedList from '@editorjs/nested-list';
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Quote from '@editorjs/quote';
import Underline from '@editorjs/underline';
import Strikethrough from '@sotaproject/strikethrough';
import {TeFormulaBlock} from '../../block/te-formula-block.class';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
import {teComponentBlockFactory} from '../../block/te-component-block.class';
import {TeHintBlock} from '../../block/te-hint-block.class';
import {TeHeaderWithIdBlock} from '../../block/te-header-with-id-block.class';
import {TeVideoBlock} from '../../block/te-video-block.class';

@Component({
  selector: 'te-text-editor',
  templateUrl: './te-text-editor.component.html',
  styleUrl: './te-text-editor.component.scss',
})
export class TeTextEditorComponent implements OnInit, OnDestroy {

  @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef<HTMLElement>;

  editor: EditorJS;

  constructor(private envInjector: EnvironmentInjector,
              private applicationRef: ApplicationRef) {
  }

  ngOnInit(): void {


    const data: OutputData = {
      time: 1703676274906,
      blocks: [
        {
          id: '-JiHr_aTiF',
          type: 'header',
          'data': {text: 'SImple title', level: 2}
        },
        {id: 'EeX4cgOEbn', type: 'paragraph', data: {text: 'Text'}},
        {id: 'EeX4cgOkjhEbn', type: 'hint', data: {hintType: 'info', content: '<p>Text</p><script>alert("A")</script>'}},
        // {id: 'EeX4cgOEjhjbn', type: 'video', data:
        //     {url: 'https://www.youtube.com/embed/L2jNEUoHP0U', title: 'Tess', caption: 'kjhkjh'}},
        // {
        //   id: 'cCRXafezGG',
        //   type: 'formula',
        //   data: {formula: 'e=mc^2', title: 'Super', caption: 'THE caption'}
        // }
      ],
      version: '2.28.2'
    };

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
          class: TeHeaderWithIdBlock as any,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2
          },
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
          class: teComponentBlockFactory(TeFormulaBlock, this.envInjector, this.applicationRef),
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
        hint: {
          class: TeHintBlock,
          inlineToolbar: true,
        },
        video: teComponentBlockFactory(TeVideoBlock, this.envInjector, this.applicationRef),
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

  printJson(): void {
    this.editor.save().then((outputData) => {
      console.log('Article data: ', outputData);
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
