import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import edjsHTML from 'editorjs-html';
import {TeRichTextContent} from '@monorepo/text-editor';

@Component({
  selector: 'te-text-editor-server-side',
  templateUrl: './te-text-editor-server-side.component.html',
  styleUrl: './te-text-editor-server-side.component.scss',
})
export class TeTextEditorServerSideComponent implements OnInit{

  @Input()
    // @ts-ignore
  value: TeRichTextContent;

  edjsParser = edjsHTML();

  htmlValue: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.value != null){
      let HTML = this.edjsParser.parse(this.value as any);
      this.htmlValue = HTML.map((row: any) => row instanceof Error ? '' : row).join('<br>');
    }
  }

}
