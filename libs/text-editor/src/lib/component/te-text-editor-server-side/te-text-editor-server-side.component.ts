import {Component, ElementRef, Input, OnInit} from '@angular/core';
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
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.value != null){
      let HTML = this.edjsParser.parse(this.value as any);
      HTML = HTML.map((row: any) => row instanceof Error ? '' : row)
      this.elementRef.nativeElement.innerHTML = '<div class="g-text-editor">' + HTML.join('<br>') + '</div>';
    }
  }

}
