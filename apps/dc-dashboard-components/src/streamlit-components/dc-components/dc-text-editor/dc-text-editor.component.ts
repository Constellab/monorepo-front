import {
  Component,
  effect,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import { Observable, of } from 'rxjs';

import { DcAuthenticationInfo, DcDynamicComponent } from '../../../core/model/dc-dynamic-component.class';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';
import { DcTextEditorConfig } from './dc-text-editor.config';

export interface DcRichTextConfig {
  placeholder: string;
  initialValue: TeRichTextDTO;
  value: TeRichTextDTO;
  disabled: boolean;
  minHeight: string;
  maxHeight: string;
  // config: {
  //   api_url: string;
  //   image_folder: string;
  // };
}

export function dcParseJsonInput1(value: string | any): DcRichTextConfig | undefined {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('Failed to parse inputData as JSON:', e);
      throw e;
    }
  }
  return value;
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
  inputData = input<DcRichTextConfig, string | DcRichTextConfig>({} as DcRichTextConfig, {
    transform: dcParseJsonInput1,
  });
  @Input() authenticationInfo?: DcAuthenticationInfo;
  @Output() outputEvent = new EventEmitter<TeRichTextDTO>();

  @HostBinding('style.minHeight') minHeight = signal<string>('');
  @HostBinding('style.maxHeight') maxHeight = signal<string>('');

  placeholder = signal<string>(null);
  textEditorConfig = signal<DcTextEditorConfig>(new DcTextEditorConfig());
  formCtrl = signal(new FormControl<TeRichText>(null));

  private mainDirective = inject(DcCoreMainDirective);

  constructor() {
    // Effect to reactively update form control when inputData changes
    effect(() => {
      const data = this.inputData();

      // Update placeholder
      if (data.placeholder != null) {
        this.placeholder.set(data.placeholder);
      }

      // Handle value input - always set if provided and not null
      if (data.value != null) {
        const richText = new TeRichText(data.value);
        this.formCtrl().setValue(richText, { emitEvent: false });
      }
      // Handle initialValue - only set if form value is null and initialValue is not null
      else if (this.formCtrl().value == null && data.initialValue != null) {
        const richText = new TeRichText(data.initialValue);
        this.formCtrl().setValue(richText, { emitEvent: false });
      }

      // Update disabled state
      if (!!data.disabled !== this.formCtrl().disabled) {
        console.log('Updating form control disabled state', this.formCtrl().disabled, '->', data.disabled);
        if (data.disabled) {
          this.formCtrl().disable();
        } else {
          this.formCtrl().enable();
        }
      }

      // Update height styles
      if (data.minHeight) {
        this.minHeight.set(data.minHeight);
      }

      if (data.maxHeight) {
        this.maxHeight.set(data.maxHeight);
      }
    });
  }

  saveFunc = (value: TeRichText): Observable<any> => {
    this.outputEvent.emit(value.toJson());
    return of(value.toJson());
  };

  ngOnInit(): void {
    this.mainDirective.init(this.authenticationInfo);
  }
}
