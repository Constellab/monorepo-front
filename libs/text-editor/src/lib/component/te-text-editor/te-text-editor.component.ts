import {
  Component, ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  Self, ViewChild
} from '@angular/core';
import {TeConfig} from '../../model/te-config.class';
import {FlFormFieldDirective} from '@monorepo/front-core-lib';
import {NgControl} from '@angular/forms';
import {TeRichTextContent} from '../../model/te-rich-text.class';
import {Subject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';


@Component({
  selector: 'te-text-editor',
  templateUrl: './te-text-editor.component.html',
  styleUrl: './te-text-editor.component.scss',
})
export class TeTextEditorComponent extends FlFormFieldDirective<TeRichTextContent> implements OnInit, OnDestroy {

  @Input({required: true}) config: TeConfig;

  @Input() placeholder: string = '';

  @Input() hideToolbar: boolean = false;

  /**
   * If true an inline padding is added to include the tooltip button in this component
   */
  @Input() includeToolbarButton: boolean = false;


  @Output() textChange: EventEmitter<TeRichTextContent> = new EventEmitter<TeRichTextContent>();

  browserSide: boolean = false;

  editorDisabled$ = new Subject<boolean>();

  constructor(@Optional() @Self() ngControl: NgControl,
              @Inject(PLATFORM_ID) private platformId: object) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.initPlatform();
  }

  callChangeEvent(value: TeRichTextContent): void {
    this.textChange.emit(value);
  }

  onDisableChange(disable: boolean): void {
    this.disabled = disable;
    this.editorDisabled$.next(disable);
  }

  writeValue(obj: TeRichTextContent): void {
    this.value = obj;
    this.initPlatform();
  }

  onTextChange(value: TeRichTextContent): void {
    this.setAndEmitValue(value);
  }

  private initPlatform(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.browserSide = true;
    }
  }

  ngOnDestroy(): void {
    this.editorDisabled$.complete();
  }

}
