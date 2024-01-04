import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'te-text-editor-ssr',
  templateUrl: './te-text-editor-ssr.component.html',
  styleUrl: './te-text-editor-ssr.component.scss'
})
export class TeTextEditorSsrComponent implements OnInit {

  html: string;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    // const editorJs: any = {
    //   "time": 1704274217318,
    //   "blocks": [
    //     {
    //       "id": "-JiHr_aTiF",
    //       "type": "header",
    //       "data": {
    //         "text": "Header 2",
    //         "level": 2
    //       }
    //     },
    //     {
    //       "id": "DZtL1QodXn",
    //       "type": "quote",
    //       "data": {
    //         "text": "Quote text",
    //         "caption": "",
    //         "alignment": "left"
    //       }
    //     },
    //     {
    //       "id": "iO6nL3D-LT",
    //       "type": "hint",
    //       "data": {
    //         "hintType": "info",
    //         "content": "block hint with <b>bold</b> text"
    //       }
    //     },
    //     {
    //       "id": "kljlkj",
    //       "type": "code",
    //       "data": {
    //         "code": "def get_and_call_view_on_resource_model(cls, resource_model_id: str,\\n                                            view_name: str, config_values: ConfigParamsDict,\\n                                            save_view_config: bool = False) -> CallViewResult:\\n\\n\\n        resource_model: ResourceModel = cls.get_resource_by_id(\\n            resource_model_id)\\n        return cls.call_view_on_resource_mo",
    //         "language": "python"
    //       }
    //     },
    //     {
    //       "id": "SYQqUfzek4",
    //       "type": "list",
    //       "data": {
    //         "style": "unordered",
    //         "items": [
    //           {
    //             "content": "List <b>unordered</b>",
    //             "items": [
    //               {
    //                 "content": "Sub element<b></b>",
    //                 "items": []
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "id": "9FTetGxDBs",
    //       "type": "list",
    //       "data": {
    //         "style": "ordered",
    //         "items": [
    //           {
    //             "content": "List ordered",
    //             "items": [
    //               {
    //                 "content": "Sub element ordered",
    //                 "items": []
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "id": "_NvffMZHya",
    //       "type": "paragraph",
    //       "data": {
    //         "text": ""
    //       }
    //     },
    //     {
    //       "id": "VjS17RQqtG",
    //       "type": "figure",
    //       "data": {
    //         "filename": "be464a78-02d7-4285-833f-12e66368b7da_1704272895000.jpg",
    //         "width": 1536,
    //         "height": 2048,
    //         "naturalHeight": 2048,
    //         "naturalWidth": 1536,
    //         "title": "Image title",
    //         "caption": "Caption"
    //       }
    //     },
    //     {
    //       "id": "tU_HV_XJL1",
    //       "type": "video",
    //       "data": {
    //         "url": "https://www.youtube.com/embed/WefxVZLhm9U",
    //         "title": "Video title",
    //         "caption": "Video caption"
    //       }
    //     },
    //     {
    //       "id": "IgLpJu521n",
    //       "type": "paragraph",
    //       "data": {
    //         "text": "Simple text with bolder, <u>underscore</u>, italic and <s>strike</s> texts and <code>code</code> text"
    //       }
    //     },
    //     {
    //       "id": "gdZ9T5x5pv",
    //       "type": "paragraph",
    //       "data": {
    //         "text": "Here is a text with a <a href=\"https://www.youtube.com/watch?v=WefxVZLhm9U\">link</a>"
    //       }
    //     },
    //     {
    //       "id": "3fK3DIyoWC",
    //       "type": "paragraph",
    //       "data": {
    //         "text": ""
    //       }
    //     },
    //     {
    //       "id": "sc_QctgBW8",
    //       "type": "formula",
    //       "data": {
    //         "formula": "e=mc^2",
    //         "title": "Equation title",
    //         "caption": "Equation caption"
    //       }
    //     },
    //     {
    //       "id": "2ub1Z3SYmN",
    //       "type": "paragraph",
    //       "data": {
    //         "text": ""
    //       }
    //     }
    //   ],
    //   "version": "2.28.2"
    // }
    // const html = parse().parse(editorJs);
    //
    //
    // this.html = this.sanitizer.sanitize(SecurityContext.HTML, html);
  }


}
