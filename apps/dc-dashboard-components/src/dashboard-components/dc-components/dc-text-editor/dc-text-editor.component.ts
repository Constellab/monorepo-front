import { HttpClient } from '@angular/common/http';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  HostBinding,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { TeRichText, TeRichTextDTO, TeTextEditorModule, TeTools } from '@monorepo/text-editor';
import { Observable, of } from 'rxjs';

import { DcDynamicComponent, dcParseJsonInput } from '../../../core/model/dc-dynamic-component.class';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';
import { DcRichTextImageObject, DcTextEditorConfig } from './dc-text-editor.config';

export interface DcRichTextConfig {
  placeholder?: string;
  initialValue?: TeRichTextDTO;
  value?: TeRichTextDTO;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
  changeEventDebounceTime?: number;
  /**
   * Object owning the images of the rich text. The image block is only enabled when it is set.
   */
  imageConfig?: DcRichTextImageObject;
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
export class DcTextEditorComponent implements DcDynamicComponent<DcRichTextConfig, TeRichTextDTO> {
  inputData = input({} as DcRichTextConfig, {
    transform: dcParseJsonInput,
  });
  authenticationInfo = input(null, {
    transform: dcParseJsonInput,
  });

  outputEvent = output<TeRichTextDTO>();

  useCustomTools = input(false, { transform: booleanAttribute });
  customTools = input<TeTools>();

  @HostBinding('style.minHeight') minHeight = '';
  @HostBinding('style.maxHeight') maxHeight = '';

  placeholder = signal<string>(null);
  textEditorConfig = signal<DcTextEditorConfig>(null);
  formCtrl = signal(new FormControl<TeRichText>(null));

  private mainDirective = inject(DcCoreMainDirective);
  private httpClient = inject(HttpClient);

  changeEventDebounceTime = computed(() => {
    const dt = this.inputData().changeEventDebounceTime;
    return dt != null && dt >= 0 ? dt : 2500;
  });

  // Object owning the images, extracted from the input data. Computed (and not read directly in
  // the effect) so the config is only rebuilt when the object actually changes: the input data
  // gets a new identity on every content change.
  private imageConfig = computed<DcRichTextImageObject | undefined>(() => this.inputData().imageConfig, {
    equal: (a: DcRichTextImageObject | undefined, b: DcRichTextImageObject | undefined) =>
      a?.objectType === b?.objectType && a?.objectId === b?.objectId,
  });

  constructor() {
    // Effect to initialize text editor config
    effect(() => {
      // read here so the config is rebuilt once the object is known: the input data is set
      // asynchronously, otherwise the image block would stay disabled
      const imageConfig = this.imageConfig();

      if (this.useCustomTools()) {
        // When custom tools are enabled, create config and once tools is provided
        if (this.customTools()) {
          const textEditorConfig = new DcTextEditorConfig(this.httpClient, this.customTools(), imageConfig);
          this.textEditorConfig.set(textEditorConfig);
        }
      } else {
        this.textEditorConfig.set(new DcTextEditorConfig(this.httpClient, undefined, imageConfig));
      }
    });

    effect(() => {
      if (this.authenticationInfo()) {
        this.mainDirective.init(this.authenticationInfo());
      }
    });

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
        if (data.disabled) {
          this.formCtrl().disable();
        } else {
          this.formCtrl().enable();
        }
      }

      // Update height styles
      if (data.minHeight) {
        this.minHeight = data.minHeight;
      }

      if (data.maxHeight) {
        this.maxHeight = data.maxHeight;
      }
    });
  }

  saveFunc = (value: TeRichText): Observable<any> => {
    this.outputEvent.emit(value.toJson());
    return of(value.toJson());
  };
}
