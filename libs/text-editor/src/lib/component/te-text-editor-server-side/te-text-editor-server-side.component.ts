import { Component, Input, OnInit } from '@angular/core';
import edjsHTML from 'editorjs-html';
import { TeRichText } from '../../model/lib';

@Component({
  selector: 'te-text-editor-server-side',
  templateUrl: './te-text-editor-server-side.component.html',
  styleUrl: './te-text-editor-server-side.component.scss',
})
export class TeTextEditorServerSideComponent implements OnInit {
  @Input({ required: true }) richText: TeRichText;

  htmlValue: string;

  ngOnInit(): void {
    if (this.richText != null) {
      const parser = edjsHTML();
      const HTML = parser.parse(this.richText.toHTMLEditorJson());
      this.htmlValue = HTML.map((row: any) => (row instanceof Error ? '' : row)).join('<br>');
    }
  }
}
