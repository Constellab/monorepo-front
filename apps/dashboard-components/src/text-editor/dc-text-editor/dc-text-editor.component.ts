import { Component, inject, OnInit, signal } from '@angular/core';
import { TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { Streamlit } from 'streamlit-component-lib';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DcTextEditorConfig } from './dc-text-editor.config';
import { DcCoreMainDirective } from '../../core/dc-core-main/dc-core-main.directive';
import { DcResizeIframeDirective } from '../../core/dc-resize-iframe/dc-resize-iframe.directive';

export interface DcRichTextConfig {
  placeholder: string;
  initial_value: TeRichTextDTO;
  disabled: boolean;
  // config: {
  //   api_url: string;
  //   image_folder: string;
  // };
}

@Component({
  standalone: true,
  imports: [TeTextEditorModule, ReactiveFormsModule, FlTranslateModule],
  selector: 'dc-root',
  templateUrl: './dc-text-editor.component.html',
  styleUrl: './dc-text-editor.component.scss',
  hostDirectives: [DcCoreMainDirective, DcResizeIframeDirective],
})
export class DcTextEditorComponent implements OnInit {
  placeholder = signal<string>(null);

  textEditorConfig: DcTextEditorConfig;

  formCtrl = new FormControl<TeRichText>(null);

  private mainDirective = inject(DcCoreMainDirective);

  saveFunc = (value: TeRichText): Observable<any> => {
    Streamlit.setComponentValue(value.toJson());
    return of(value.toJson());
  };

  ngOnInit(): void {
    this.mainDirective.getInitData().subscribe((data) => this.init(data));
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
  }
}
