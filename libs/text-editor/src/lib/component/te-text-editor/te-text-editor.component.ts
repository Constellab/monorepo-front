import {Component, EventEmitter, Inject, Input, Optional, Output, PLATFORM_ID, Self} from '@angular/core';
import {TeConfig} from '../../model/te-config.class';
import {FlFormFieldDirective} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';
import {TeRichTextContent} from '../../model/te-rich-text.class';
import {isPlatformBrowser} from '@angular/common';


@Component({
  selector: 'te-text-editor',
  templateUrl: './te-text-editor.component.html',
  styleUrl: './te-text-editor.component.scss',
})
export class TeTextEditorComponent extends FlFormFieldDirective<TeRichTextContent> {

  @Input({required: true}) config: TeConfig;

  @Input() placeholder: string;

  @Input() hideToolbar: boolean = false;

  /**
   * If true an inline padding is added to include the tooltip button in this component
   */
  @Input() includeToolbarButton: boolean = false;

  @Output() textChange: EventEmitter<TeRichTextContent> = new EventEmitter<TeRichTextContent>();

  browserSide: boolean = false;

  constructor(@Optional() @Self() ngControl: NgControl,
              @Inject(PLATFORM_ID) private platformId: object) {
    super(ngControl);
    if (isPlatformBrowser(this.platformId)) {
      this.browserSide = true;
    }
  }

  callChangeEvent(value: TeRichTextContent): void {
    this.textChange.emit(value);
  }

  onDisableChange(): void {
  }

  writeValue(obj: TeRichTextContent): void {
    this.value = obj;
  }

  onTextChange(value: TeRichTextContent): void {
    this.setAndEmitValue(value);
  }

}
