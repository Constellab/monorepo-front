import { Component, EventEmitter, HostBinding, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import { Observable, of } from 'rxjs';
import { Streamlit } from 'streamlit-component-lib';

import {
  DcAuthenticationInfo,
  DcDynamicComponent,
  dcParseJsonInput,
} from '../../../core/model/dc-dynamic-component.class';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';
import { DcTextEditorConfig } from './dc-text-editor.config';

export interface DcRichTextConfig {
  placeholder: string;
  initialValue: TeRichTextDTO;
  disabled: boolean;
  minHeight: string;
  maxHeight: string;
  // config: {
  //   api_url: string;
  //   image_folder: string;
  // };
}

@Component({
  standalone: true,
  imports: [TeTextEditorModule, ReactiveFormsModule, FlTranslateModule],
  selector: 'dc-text-editor',
  templateUrl: './dc-text-editor.component.html',
  styleUrl: './dc-text-editor.component.scss',
  hostDirectives: [DcCoreMainDirective],
  host: {
    class: 'g-scrollable-element',
  },
})
export class DcTextEditorComponent implements OnInit, DcDynamicComponent<DcRichTextConfig, TeRichTextDTO> {
  @Input({ transform: dcParseJsonInput }) inputData: DcRichTextConfig;
  @Input() authenticationInfo?: DcAuthenticationInfo;
  @Output() outputEvent = new EventEmitter<TeRichTextDTO>();

  @HostBinding('style.minHeight') minHeight: string;
  @HostBinding('style.maxHeight') maxHeight: string;

  placeholder = signal<string>(null);

  textEditorConfig: DcTextEditorConfig;

  formCtrl = new FormControl<TeRichText>(null);

  private mainDirective = inject(DcCoreMainDirective);

  saveFunc = (value: TeRichText): Observable<any> => {
    this.outputEvent.emit(value.toJson());
    return of(value.toJson());
  };

  ngOnInit(): void {
    console.log('DcProcessConfigComponent ngOnInit', this.inputData, this.authenticationInfo);
    this.mainDirective.init(this.authenticationInfo);
    this.init(this.inputData);
  }

  private init(data: DcRichTextConfig): void {
    this.placeholder.set(data.placeholder);

    if (data.initialValue) {
      const richText = new TeRichText(data.initialValue);
      this.formCtrl.setValue(richText, { emitEvent: false });
      Streamlit.setComponentValue(data.initialValue);
    }

    this.textEditorConfig = new DcTextEditorConfig();

    if (data.disabled !== this.formCtrl.disabled) {
      if (data.disabled) {
        this.formCtrl.disable();
      } else {
        this.formCtrl.enable();
      }
    }

    if (data.minHeight) {
      this.minHeight = data.minHeight;
    }

    if (data.maxHeight) {
      this.maxHeight = data.maxHeight;
    }
  }
}
