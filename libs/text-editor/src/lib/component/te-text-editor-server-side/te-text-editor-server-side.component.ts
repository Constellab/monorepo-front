import { Component, Input, OnInit } from '@angular/core';
import edjsHTML from 'editorjs-html';
import { TeRichTextContent } from '../../model/te-rich-text.class';

@Component({
  selector: 'te-text-editor-server-side',
  templateUrl: './te-text-editor-server-side.component.html',
  styleUrl: './te-text-editor-server-side.component.scss',
})
export class TeTextEditorServerSideComponent implements OnInit {
  @Input({ required: true }) value: TeRichTextContent;

  htmlValue: string;

  ngOnInit(): void {
    if (this.value != null) {
      const parser = edjsHTML();
      const HTML = parser.parse(this.value);
      this.htmlValue = HTML.map((row: any) => (row instanceof Error ? '' : row)).join('<br>');
    }
  }
}
