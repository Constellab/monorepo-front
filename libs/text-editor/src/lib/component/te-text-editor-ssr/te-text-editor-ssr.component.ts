import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID,} from '@angular/core';
import edjsHTML from 'editorjs-html';
import {FormControl} from '@angular/forms';

import {isPlatformServer} from '@angular/common';
import {TeConfig} from '../../model/te-config.class';
import {TeRichText, TeRichTextContent} from '../../model/te-rich-text.class';

@Component({
  selector: 'te-text-editor-ssr',
  templateUrl: './te-text-editor-ssr.component.html',
  styleUrl: './te-text-editor-ssr.component.scss'
})
export class TeTextEditorSsrComponent implements OnInit {

  edjsParser = edjsHTML();
  @Input({required: true}) config: TeConfig;
  @Input() placeholder: string = '';
  @Input() hideToolbar: boolean = false;
  @Input() includeTooltipButton: boolean = false;
  @Output() textChange: EventEmitter<TeRichTextContent> = new EventEmitter<TeRichTextContent>();
  @Input() control: FormControl<TeRichText>;
  browserSide: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object,
              private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      let HTML = this.edjsParser.parse(this.control.value as any);
      HTML = HTML.map((row: any) => row instanceof Error ? '' : row)
      this.elementRef.nativeElement.innerHTML = '<div class="g-text-editor">' + HTML.join('<br>') + '</div>';
    } else {
      this.browserSide = true;
    }
  }

  callChangeEvent(value: TeRichTextContent): void {
    this.textChange.emit(value);
  }

}
