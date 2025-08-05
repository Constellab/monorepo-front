import { Component, EventEmitter, HostBinding, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import { Observable, of } from 'rxjs';
import { Streamlit } from 'streamlit-component-lib';

import { DcComponentData, DcDynamicComponent } from '../../../core/model/dc-dynamic-component.class';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';
import { DcTextEditorConfig } from './dc-text-editor.config';

export interface DcRichTextConfig {
  placeholder: string;
  initial_value: TeRichTextDTO;
  disabled: boolean;
  min_height: string;
  max_height: string;
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
  @Input() inputData: DcComponentData<DcRichTextConfig>;
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
    this.mainDirective.init(this.inputData);
    this.init(this.inputData.component_data);
  }

  private init(data: DcRichTextConfig): void {
    this.placeholder.set(data.placeholder);

    if (data.initial_value) {
      const richText = new TeRichText(data.initial_value);
      this.formCtrl.setValue(richText, { emitEvent: false });
      Streamlit.setComponentValue(data.initial_value);
    }

    this.textEditorConfig = new DcTextEditorConfig();

    if (data.disabled !== this.formCtrl.disabled) {
      if (data.disabled) {
        this.formCtrl.disable();
      } else {
        this.formCtrl.enable();
      }
    }

    if (data.min_height) {
      this.minHeight = data.min_height;
    }

    if (data.max_height) {
      this.maxHeight = data.max_height;
    }
  }
}
