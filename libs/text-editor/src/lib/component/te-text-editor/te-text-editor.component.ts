import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  Self,
} from '@angular/core';
import { TeConfig } from '../../model/te-config.class';
import { FlFormFieldDirective } from '@monorepo/front-core-lib';
import { NgControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { TeEvent } from '../../model/te-event.class';
import { TeRichText } from '../../model/lib';

@Component({
    selector: 'te-text-editor',
    templateUrl: './te-text-editor.component.html',
    styleUrl: './te-text-editor.component.scss',
    standalone: false
})
export class TeTextEditorComponent extends FlFormFieldDirective<TeRichText> implements OnInit {
  @Input({ required: true }) config: TeConfig;

  @Input() event: TeEvent;

  @Input() placeholder: string;

  /**
   * In dense mode the paragraph have less padding
   */
  @HostBinding('class.g-te-dense') dense: boolean = false;

  @Output() textChange: EventEmitter<TeRichText> = new EventEmitter();

  browserSide: boolean = false;

  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    super(ngControl);
    if (isPlatformBrowser(this.platformId)) {
      this.browserSide = true;
    }
  }

  ngOnInit(): void {
    this.dense = this.config.uiConfig.dense;
  }

  callChangeEvent(value: TeRichText): void {
    this.textChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: TeRichText): void {
    if (obj != null && !(obj instanceof TeRichText)) {
      obj = new TeRichText(obj);
    }
    this.value = obj;
  }

  onTextChange(value: TeRichText): void {
    this.setAndEmitValue(value);
  }
}
